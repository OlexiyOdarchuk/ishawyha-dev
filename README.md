# ishawyha.dev

Persistent landing for [ishawyha.dev](https://ishawyha.dev).
SvelteKit (adapter-static) · Svelte 5 · Tailwind v4 · Piton WASM playground.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # output → ./build (static)
npm run preview
```

The `build/` directory is fully static — drop it on GitHub Pages,
Cloudflare Pages, or any CDN.

## GitHub Pages

`static/CNAME` carries the custom domain. To wire up Pages:

1. Push to `main`.
2. Add a workflow that runs `npm run build` and deploys `./build`
   via `actions/upload-pages-artifact` + `actions/deploy-pages`.
3. In repo settings → Pages, choose "GitHub Actions" as source and add
   the custom domain.

## Piton interpreter

`static/piton.wasm` is the prebuilt WebAssembly artefact of the
[Piton](https://github.com/OlexiyOdarchuk/piton) interpreter, compiled
from `cmd/wasm` in the upstream repo. To rebuild:

```bash
cd /path/to/piton
GOOS=js GOARCH=wasm go build -o piton.wasm ./cmd/wasm
cp piton.wasm /path/to/this-site/static/piton.wasm
cp "$(go env GOROOT)/lib/wasm/wasm_exec.js" /path/to/this-site/static/wasm_exec.js
```
