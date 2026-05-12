// Go-via-TinyGo SHA-256 bench worker.
//
// We drive the hash loop from JS in batches because TinyGo's WASM runtime
// is single-threaded — a hot Go goroutine would starve this worker's
// event loop and freeze our reporting + stop messages. Calling a
// `benchBatch(n)` Go func per tick lets the event loop breathe between
// batches.

// Each benchBatch call costs ~µs of FFI overhead. 4k batches under-uses
// Go's throughput because we round-trip ~250×/sec. 65k keeps the round-
// trips down to ~10/sec while still keeping the worker event loop
// responsive (a 65k batch takes ~30-50 ms on a modern laptop).
const BATCH = 65536;
const REPORT_EVERY = 200; // ms between count posts to main thread

let ready = false;
let running = false;
let reportTimer = null;

function send(msg) {
  self.postMessage(msg);
}
function fail(where, err) {
  send({ type: 'error', where, error: err && err.message ? err.message : String(err) });
}

try {
  importScripts('/wasm_exec_tinygo.js');
} catch (err) {
  fail('importScripts', err);
}

(async () => {
  try {
    if (typeof self.Go !== 'function') {
      throw new Error('TinyGo wasm_exec did not export Go (self.Go missing)');
    }
    const go = new self.Go();
    let instance;
    try {
      const res = await WebAssembly.instantiateStreaming(
        fetch('/bench-sha256.wasm'),
        go.importObject
      );
      instance = res.instance;
    } catch (streamErr) {
      const resp = await fetch('/bench-sha256.wasm');
      if (!resp.ok) throw new Error(`fetch /bench-sha256.wasm: ${resp.status}`);
      const bytes = await resp.arrayBuffer();
      const res = await WebAssembly.instantiate(bytes, go.importObject);
      instance = res.instance;
    }
    go.run(instance); // fire-and-forget; TinyGo main parks on select{}

    const t0 = performance.now();
    while (!self.benchReady && performance.now() - t0 < 10000) {
      await new Promise((r) => setTimeout(r, 25));
    }
    if (!self.benchReady) throw new Error('benchReady not flipped within 10s');

    ready = true;
    send({ type: 'ready' });
  } catch (err) {
    fail('instantiate', err);
  }
})();

async function loop() {
  while (running) {
    try {
      self.benchBatch(BATCH);
    } catch (err) {
      fail('benchBatch', err);
      running = false;
      return;
    }
    // Yield to the worker event loop so the reporter timer + onmessage
    // (stop) get a chance to run. setTimeout(0) is enough.
    await new Promise((r) => setTimeout(r, 0));
  }
}

function startReporting() {
  if (reportTimer) return;
  reportTimer = setInterval(() => {
    if (!ready) return;
    send({
      type: 'count',
      count: self.benchCount(),
      tokens: self.benchTokens()
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
      // hashes its own slice of the nonce space.
      const offset = typeof msg.nonceOffset === 'number' ? msg.nonceOffset : 0;
      self.benchReset(offset);
      running = true;
      startReporting();
      loop();
    } else if (msg.type === 'stop') {
      running = false;
      stopReporting();
      send({
        type: 'count',
        count: self.benchCount(),
        tokens: self.benchTokens(),
        final: true
      });
    }
  } catch (err) {
    fail('cmd', err);
  }
};
