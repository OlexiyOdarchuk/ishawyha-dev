declare global {
  namespace App {}

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
