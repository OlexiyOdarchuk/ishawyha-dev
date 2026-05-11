import { browser } from '$app/environment';

type Status = 'idle' | 'loading' | 'ready' | 'error';

let runnerStatus: Status = 'idle';
let runnerPromise: Promise<void> | null = null;

let vizReady = false;
let vizPromise: Promise<void> | null = null;

export function getStatus(): Status {
  return runnerStatus;
}

function loadScript(src: string, dataKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-${dataKey}]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`${dataKey} failed`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset[dataKey] = 'true';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function waitForGlobal(name: string, timeoutMs = 30000): Promise<void> {
  const start = Date.now();
  while (!(name in window)) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`${name} never registered`);
    }
    await new Promise((r) => setTimeout(r, 25));
  }
}

// Both TinyGo's and Go's wasm_exec.js set window.Go. We load the TinyGo
// runtime first, capture its constructor, then load Go's (which overwrites
// window.Go) before instantiating the viz module.
type GoCtor = new () => {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
};

export async function loadPiton(): Promise<void> {
  if (!browser) return;
  if (runnerStatus === 'ready') return;
  if (runnerPromise) return runnerPromise;

  runnerStatus = 'loading';
  runnerPromise = (async () => {
    try {
      await loadScript('/wasm_exec_tinygo.js', 'goTinyGo');
      const GoTiny = (window as unknown as { Go: GoCtor }).Go;
      const go = new GoTiny();
      const result = await WebAssembly.instantiateStreaming(fetch('/piton-runner.wasm'), go.importObject);
      // Fire-and-forget — TinyGo program parks on `select {}` forever so the
      // JS callbacks stay live. We never await go.run.
      void go.run(result.instance);
      await waitForGlobal('runPiton');
      runnerStatus = 'ready';
    } catch (err) {
      runnerStatus = 'error';
      runnerPromise = null;
      throw err;
    }
  })();
  return runnerPromise;
}

export function ensureViz(): Promise<void> {
  if (!browser) return Promise.resolve();
  if (vizReady) return Promise.resolve();
  if (vizPromise) return vizPromise;
  vizPromise = (async () => {
    try {
      await loadPiton(); // runner must be up first (and TinyGo's wasm_exec parked)
      await loadScript('/wasm_exec.js', 'goWasm');
      const GoStd = (window as unknown as { Go: GoCtor }).Go;
      const go = new GoStd();
      const result = await WebAssembly.instantiateStreaming(fetch('/piton-viz.wasm'), go.importObject);
      void go.run(result.instance);
      await waitForGlobal('visualizePiton');
      vizReady = true;
    } catch (err) {
      vizPromise = null;
      throw err;
    }
  })();
  return vizPromise;
}

export function runPiton(code: string): string {
  if (!browser || !window.runPiton) return '';
  return window.runPiton(code);
}

export async function visualizePiton(code: string): Promise<string> {
  if (!browser) return '';
  await ensureViz();
  if (!window.visualizePiton) return '';
  return window.visualizePiton(code);
}
