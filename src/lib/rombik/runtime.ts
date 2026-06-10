import { browser } from '$app/environment';
import { base } from '$app/paths';
import { parseTree, fromAst, renderSvg } from 'rombik-engine';

// rombik in the browser, no server, no Python, no Go:
//   web-tree-sitter (WASM grammar) parses Python -> Tree
//   rombik-engine (pure TypeScript, zero runtime deps) turns the tree into
//   { name, diagram } per function and renders DSTU flowcharts to SVG.
// Everything is lazy: nothing loads until the first generate() call.

export type Status = 'idle' | 'loading' | 'ready' | 'error';
export type LoadStage = 'engine' | 'build';
export type RombikFn = { name: string; svg: string };
export type RombikResult = { functions?: RombikFn[]; error?: string };

let status: Status = 'idle';
let initPromise: Promise<void> | null = null;

// web-tree-sitter is loaded from a static prebuilt bundle (not bundled by Vite),
// so the Parser/Language handles are untyped here.
/* eslint-disable @typescript-eslint/no-explicit-any */
let parser: any = null;
let pythonLang: any = null;
/* eslint-enable @typescript-eslint/no-explicit-any */

export function getStatus(): Status {
  return status;
}

async function init(onProgress?: (stage: LoadStage) => void): Promise<void> {
  onProgress?.('engine');
  // Static ESM bundle of web-tree-sitter, served verbatim from static/rombik/.
  const mod = await import(/* @vite-ignore */ `${base}/rombik/tree-sitter.js`);
  const { Parser, Language } = mod;
  await Parser.init({ locateFile: () => `${base}/rombik/tree-sitter.wasm` });
  parser = new Parser();
  pythonLang = await Language.load(`${base}/rombik/tree-sitter-python.wasm`);
  parser.setLanguage(pythonLang);
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

/**
 * generate(code) parses Python with tree-sitter (the code is NOT executed) and
 * builds DSTU flowcharts via rombik-engine. Returns one SVG per function (plus
 * the module-level body), or an error.
 */
export async function generate(
  code: string,
  onProgress?: (stage: LoadStage) => void
): Promise<RombikResult> {
  if (!browser) return {};
  await warmup(onProgress);
  onProgress?.('build');

  try {
    const tree = parser.parse(code);
    const ast = parseTree(tree, 'python');
    const functions = fromAst(ast, {}).map((r) => ({
      name: r.name,
      svg: renderSvg(r.diagram)
    }));
    if (!functions.length && tree.rootNode.hasError) {
      return { error: 'Синтаксична помилка в коді' };
    }
    return { functions };
  } catch (e) {
    return { error: 'engine: ' + ((e as Error)?.message ?? e) };
  }
}
