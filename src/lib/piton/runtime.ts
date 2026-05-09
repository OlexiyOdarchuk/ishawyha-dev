import { browser } from '$app/environment';

type Status = 'idle' | 'loading' | 'ready' | 'error';

let status: Status = 'idle';
let loadPromise: Promise<void> | null = null;

export function getStatus(): Status {
  return status;
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

function loadGoRuntime(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('not browser'));
  if (window.Go) return Promise.resolve();
  return loadScript('/wasm_exec.js', 'goWasm');
}

interface DagreGlobal {
  Graph?: unknown;
  graphlib?: { Graph: unknown };
  layout?: unknown;
}

function loadDagre(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('not browser'));
  const w = window as unknown as { dagre?: DagreGlobal };
  if (w.dagre?.Graph) return Promise.resolve();
  return loadScript('/dagre.min.js', 'dagreLib').then(() => {
    // Piton's WASM expects dagre.Graph at top-level; dagre@0.8.5 puts it
    // under graphlib. Bridge the two so the visualizer can find it.
    const dagre = w.dagre;
    if (dagre && !dagre.Graph && dagre.graphlib?.Graph) {
      dagre.Graph = dagre.graphlib.Graph;
    }
  });
}

async function waitForGlobals(timeoutMs = 8000): Promise<void> {
  const start = Date.now();
  while (!window.runPiton || !window.visualizePiton) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Piton globals never registered');
    }
    await new Promise((r) => setTimeout(r, 25));
  }
}

export async function loadPiton(): Promise<void> {
  if (!browser) return;
  if (status === 'ready') return;
  if (loadPromise) return loadPromise;

  status = 'loading';
  loadPromise = (async () => {
    try {
      await Promise.all([loadGoRuntime(), loadDagre()]);
      const go = new window.Go();
      const result = await WebAssembly.instantiateStreaming(fetch('/piton.wasm'), go.importObject);
      // Fire-and-forget — Go program blocks on a channel forever.
      // Globals get registered synchronously inside main() before it parks.
      void go.run(result.instance);
      await waitForGlobals();
      status = 'ready';
    } catch (err) {
      status = 'error';
      loadPromise = null;
      throw err;
    }
  })();
  return loadPromise;
}

export function runPiton(code: string): string {
  if (!browser || !window.runPiton) return '';
  return window.runPiton(code);
}

export function visualizePiton(code: string): string {
  if (!browser || !window.visualizePiton) return '';
  return window.visualizePiton(code);
}
