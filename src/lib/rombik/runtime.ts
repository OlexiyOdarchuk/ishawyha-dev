import { browser } from '$app/environment';

// rombik in the browser, no server:
//   Pyodide (CPython in WASM) runs parser.py -> AST-JSON
//   rombik.wasm (Go) turns AST-JSON + options -> { functions:[{name, svg}] }
// Everything is lazy: nothing loads until the first generate() call.

const PYODIDE_VER = '0.27.2';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VER}/full/`;

export type Status = 'idle' | 'loading' | 'ready' | 'error';
export type LoadStage = 'python' | 'engine' | 'build';
export type RombikFn = { name: string; svg: string };
export type RombikResult = { functions?: RombikFn[]; error?: string };

let status: Status = 'idle';
let initPromise: Promise<void> | null = null;

// Pyodide has no types here; treat as unknown-ish.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;
let parserSrc = '';

type GoCtor = new () => {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
};

declare global {
  interface Window {
    Go: GoCtor;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide?: (opts: { indexURL: string }) => Promise<any>;
    rombikGenerate?: (astJSON: string, optionsJSON: string) => string;
  }
}

export function getStatus(): Status {
  return status;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`failed to load ${src}`)), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => {
      s.dataset.loaded = 'true';
      resolve();
    };
    s.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function waitForGlobal(name: keyof Window, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (!(name in window) || !window[name]) {
    if (Date.now() - start > timeoutMs) throw new Error(`${String(name)} never registered`);
    await new Promise((r) => setTimeout(r, 25));
  }
}

async function init(onProgress?: (stage: LoadStage) => void): Promise<void> {
  onProgress?.('python');
  await loadScript(PYODIDE_CDN + 'pyodide.js');
  pyodide = await window.loadPyodide!({ indexURL: PYODIDE_CDN });

  onProgress?.('engine');
  parserSrc = await (await fetch('/rombik/parser.py')).text();
  await loadScript('/rombik/wasm_exec.js');
  const Go = window.Go;
  const go = new Go();
  const bytes = await (await fetch('/rombik/rombik.wasm')).arrayBuffer();
  const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
  // Fire-and-forget: Go's main parks on select{} so the registered callbacks
  // stay alive. We never await go.run.
  void go.run(instance);
  await waitForGlobal('rombikGenerate');
}

/** Prepare the runtime (idempotent). Safe to call early to warm up. */
export function warmup(onProgress?: (stage: LoadStage) => void): Promise<void> {
  if (!browser) return Promise.resolve();
  if (status === 'ready') return Promise.resolve();
  if (initPromise) return initPromise;
  status = 'loading';
  initPromise = init(onProgress)
    .then(() => {
      status = 'ready';
    })
    .catch((err) => {
      status = 'error';
      initPromise = null;
      throw err;
    });
  return initPromise;
}

function cleanPyError(msg: string): string {
  const lines = msg.trim().split('\n').filter(Boolean);
  // The last line of a Python traceback is the actual error (e.g. SyntaxError: …)
  return lines[lines.length - 1] ?? msg;
}

/**
 * generate(code) parses Python with Pyodide (ast.parse — code is NOT executed)
 * and builds DSTU flowcharts via rombik.wasm. Returns one SVG per function
 * (plus the module-level body), or an error.
 */
export async function generate(
  code: string,
  onProgress?: (stage: LoadStage) => void
): Promise<RombikResult> {
  if (!browser) return {};
  await warmup(onProgress);
  onProgress?.('build');

  pyodide.globals.set('src', code);
  try {
    pyodide.runPython(parserSrc);
  } catch (e) {
    return { error: cleanPyError(String((e as Error)?.message ?? e)) };
  }
  const astJSON = pyodide.globals.get('_out') as string;
  try {
    return JSON.parse(window.rombikGenerate!(astJSON, JSON.stringify({}))) as RombikResult;
  } catch (e) {
    return { error: 'engine: ' + ((e as Error)?.message ?? e) };
  }
}
