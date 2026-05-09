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

Auto-deploys on every push to `main` via `.github/workflows/deploy.yml`
(builds with `npm run build`, uploads `./build` as a Pages artifact,
deploys via `actions/deploy-pages`).

One-time setup:

1. Repo settings → **Pages** → Source: **GitHub Actions**.
2. The `static/CNAME` file is already wired to `ishawyha.dev` — after
   the first successful deploy, GitHub will pick it up. Make sure the
   DNS for `ishawyha.dev` points at GitHub Pages
   (`A` records to `185.199.108.153/109/110/111` or `CNAME` for
   `<user>.github.io` if it's a `*.github.io` deploy).
3. Optional: enable "Enforce HTTPS" once the cert provisions.

Manual run: Actions tab → **Deploy to GitHub Pages** → *Run workflow*.

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
