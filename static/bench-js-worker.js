// JS baseline — line-for-line port of MINERJS.js `calculateBlockHash`
// plus the 20-bit difficulty check (5 leading '0' hex chars) that the
// official miner submits blocks for.

const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
const miner = 'ishawyha_bench_wallet_pubkey_for_demo_only_xxxxxxxxxxxxxxxx';
const reward = '1';
const TARGET_PREFIX = '00000'; // matches MINERJS.js `n.startsWith("0".repeat(5))`

const enc = new TextEncoder();

let running = false;
let noSleep = false; // when true, skip the sleep(1)/1000 cadence
let count = 0;
let tokens = 0;
let reportTimer = null;

function send(msg) {
  self.postMessage(msg);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function calculateBlockHash(b) {
  const s = b.prevHash + b.nonce + b.miner + String(b.reward) + String(b.timestamp);
  const buf = enc.encode(s);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

async function run() {
  let nonce = 0;
  while (running) {
    const ts = Date.now();
    const hash = await calculateBlockHash({ prevHash, nonce, miner, reward, timestamp: ts });
    nonce++;
    count++;
    if (hash.startsWith(TARGET_PREFIX)) tokens++;
    // The verbatim official client throttles itself with sleep(1) every 1000
    // hashes (it ran on Angular's main thread and that pause kept the UI
    // responsive). In a Worker the throttle is pure overhead, but it's still
    // there in the real client — so we keep it by default and let the bench
    // optionally turn it off to expose how much of the slowdown is the
    // throttle itself.
    if (!noSleep && nonce % 1000 === 0) await sleep(1);
  }
}

function startReporting() {
  if (reportTimer) return;
  reportTimer = setInterval(() => send({ type: 'count', count, tokens }), 200);
}
function stopReporting() {
  if (!reportTimer) return;
  clearInterval(reportTimer);
  reportTimer = null;
}

self.onmessage = (e) => {
  const msg = e.data;
  if (msg.type === 'start' && !running) {
    running = true;
    noSleep = msg.noSleep === true;
    count = 0;
    tokens = 0;
    startReporting();
    run().catch((err) =>
      send({ type: 'error', where: 'run', error: String(err && err.message ? err.message : err) })
    );
  } else if (msg.type === 'stop') {
    running = false;
    stopReporting();
    send({ type: 'count', count, tokens, final: true });
  }
};

send({ type: 'ready' });
