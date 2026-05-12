import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';

// Capture build provenance once at config load — emitted into the bundle
// via `define` so the footer can show "<commit> · <date>" without runtime
// network calls.
function gitInfo() {
  try {
    return {
      hash: execSync('git rev-parse --short HEAD').toString().trim(),
      date: new Date().toISOString().slice(0, 10)
    };
  } catch {
    return { hash: 'dev', date: new Date().toISOString().slice(0, 10) };
  }
}
const build = gitInfo();

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  define: {
    __BUILD_HASH__: JSON.stringify(build.hash),
    __BUILD_DATE__: JSON.stringify(build.date)
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});
