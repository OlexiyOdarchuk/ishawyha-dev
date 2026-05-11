# TODO

## SHMiner WASM hashrate benchmark

Live demo on ishawyha.dev showing Go-WASM hashrate vs JS hashrate side by side.
Same input, same iterations, live counters → "1000×" claim becomes verifiable
right in the browser instead of being just text in the SHMiner card.

### Scope

- Just the **SHA-256 kernel** from SHMiner — no wallet UI, no mining target,
  no WebSocket dashboard. Pure throughput measurement.
- Two implementations running in parallel:
  1. **JS** baseline — `crypto.subtle.digest` (browser-native) or a pure-JS
     SHA-256 (to mimic SHMiner's "official client"). Pick whichever the
     original JS miner used — the 1000× claim should be against that.
  2. **Go via TinyGo** WASM — same inner loop, multiple Web Workers /
     goroutines for the worker-pool comparison.
- Frontend: a new section (`№ 09 — Benchmark` or fold into Projects) with
  two big live counters: `hashes/sec JS` · `hashes/sec Go·WASM` and a
  ratio that updates every ~200 ms.

### Tasks

- [ ] Extract `internal/sha256` (or equivalent) from SHMiner into a
      `cmd/wasm-bench/main.go` that exposes `startBench(workers)` and
      `stopBench()` to JS via `syscall/js`. Reuses the goroutine pool.
- [ ] TinyGo build + `wasm-opt -Oz` → target ~150 KB.
- [ ] JS baseline: pick — `crypto.subtle.digest` *or* port the JS SHA-256
      from the official Student Hryvnia miner (so we're measuring the
      thing SHMiner actually replaced).
- [ ] Svelte component with two Web Workers (one wraps the WASM, one
      wraps the JS hasher) + a counter loop on `requestAnimationFrame`.
- [ ] Add to i18n: `bench.title`, `bench.subtitle`, labels.
- [ ] Honest disclaimer line — what hardware, what algo, what input size.
- [ ] Update SHMiner project description on the site to link the live
      benchmark instead of just stating "1000×".

### Stretch

- Persist the user's best hashrate in localStorage and show
  "best on this device: X H/s".
- Allow toggling workers count (1, 2, 4, 8) to show goroutine scaling.

---

*Created 2026-05-12. Next session, start with the SHA-256 extraction step.*
