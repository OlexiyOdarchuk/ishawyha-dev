declare global {
  namespace App {}

  // Injected by vite.config.ts `define` at build time.
  const __BUILD_HASH__: string;
  const __BUILD_DATE__: string;

  interface Window {
    Go: new () => {
      importObject: WebAssembly.Imports;
      run(instance: WebAssembly.Instance): Promise<void>;
    };
    runPiton?: (code: string) => string;
    visualizePiton?: (code: string) => string;
  }
}

export {};
