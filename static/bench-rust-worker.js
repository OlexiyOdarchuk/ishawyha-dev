// Rust·WASM SHA-256 bench worker.
//
// The module is the very same search kernel the desktop SHMiner links in
// (rust_miner_core), rebuilt for wasm32 with +simd128. It exports plain
// wasm functions, so unlike the TinyGo build there is no wasm_exec glue
// and no Go runtime to boot — instantiate and call.
//
// We still drive the loop from JS in batches: WASM has no threads here, so
// a long loop inside the module would starve this worker's event loop and
// freeze both progress reporting and the stop button.

// A 65k batch takes ~15-20 ms, which keeps round-trips down to ~50/sec
// while leaving the event loop responsive.
const BATCH = 65536;
const REPORT_EVERY = 200; // ms between count posts to main thread

let exports = null;
let ready = false;
let running = false;
let reportTimer = null;

function send(msg) {
  self.postMessage(msg);
}
function fail(where, err) {
  send({ type: 'error', where, error: err && err.message ? err.message : String(err) });
}

(async () => {
  try {
    let instance;
    try {
      const res = await WebAssembly.instantiateStreaming(fetch('/bench-core.wasm'), {});
      instance = res.instance;
    } catch (streamErr) {
      const resp = await fetch('/bench-core.wasm');
      if (!resp.ok) throw new Error(`fetch /bench-core.wasm: ${resp.status}`);
      const bytes = await resp.arrayBuffer();
      const res = await WebAssembly.instantiate(bytes, {});
      instance = res.instance;
    }

    exports = instance.exports;
    for (const fn of ['bench_reset', 'bench_batch', 'bench_count', 'bench_tokens']) {
      if (typeof exports[fn] !== 'function') {
        throw new Error(`wasm module is missing export ${fn}`);
      }
    }

    ready = true;
    send({ type: 'ready' });
  } catch (err) {
    fail('instantiate', err);
  }
})();

async function loop() {
  while (running) {
    try {
      exports.bench_batch(BATCH);
    } catch (err) {
      fail('bench_batch', err);
      running = false;
      return;
    }
    // Yield so the reporter timer and onmessage (stop) get a chance to run.
    await new Promise((r) => setTimeout(r, 0));
  }
}

function startReporting() {
  if (reportTimer) return;
  reportTimer = setInterval(() => {
    if (!ready) return;
    send({
      type: 'count',
      count: exports.bench_count(),
      tokens: exports.bench_tokens()
    });
  }, REPORT_EVERY);
}
function stopReporting() {
  if (!reportTimer) return;
  clearInterval(reportTimer);
  reportTimer = null;
}

self.onmessage = (e) => {
  const msg = e.data;
  if (!ready) {
    fail('onmessage', new Error('not ready (still loading wasm)'));
    return;
  }
  try {
    if (msg.type === 'start') {
      if (running) return;
      // Caller may pass {nonceOffset: number} so each worker in the pool
      // hashes its own slice of the nonce space. The timestamp comes from
      // JS because wasm32-unknown-unknown has no clock.
      const offset = typeof msg.nonceOffset === 'number' ? msg.nonceOffset : 0;
      exports.bench_reset(offset, Date.now());
      running = true;
      startReporting();
      loop();
    } else if (msg.type === 'stop') {
      running = false;
      stopReporting();
      send({
        type: 'count',
        count: exports.bench_count(),
        tokens: exports.bench_tokens(),
        final: true
      });
    }
  } catch (err) {
    fail('cmd', err);
  }
};
