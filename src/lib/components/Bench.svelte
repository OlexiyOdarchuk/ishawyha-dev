<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Play, Square, Cpu, Zap, Loader2, AlertTriangle, Download, ExternalLink } from 'lucide-svelte';
  import { onMount } from 'svelte';

  type Phase = 'idle' | 'loading' | 'running' | 'done' | 'error';
  type ActiveLane = null | 'js' | 'go';
  let phase: Phase = $state('idle');
  let activeLane: ActiveLane = $state(null);
  let errorText = $state('');

  // Each lane runs alone for this long. Sequential ⇒ no CPU contention ⇒
  // both numbers are honest.
  const LANE_DURATION_MS = 10_000;

  const WORKER_OPTIONS = [1, 2, 4, 6, 8] as const;
  let hwCores = $state(4);
  let workerCount = $state<number>(4);
  let customInput = $state<string>('');
  let customError = $state<string>('');

  // "original" = verbatim MINERJS.js, including sleep(1) every 1000 hashes.
  // "fast"     = same code, but skip the self-throttle so we measure raw
  //              JS+native-crypto.subtle throughput, not the throttle.
  type JsMode = 'original' | 'fast';
  let jsMode: JsMode = $state('original');

  let jsCount = $state(0);
  let jsTokens = $state(0);
  let jsElapsedMs = $state(0);
  let goCount = $state(0);
  let goTokens = $state(0);
  let goElapsedMs = $state(0);

  // Each call to `start()` bumps runId. Async waiters compare against the
  // captured value and bail out if the user pressed Stop or hit Start again.
  let runId = 0;
  let phaseTimer: ReturnType<typeof setInterval> | null = null;

  let jsWorker: Worker | null = null;
  let jsReady = $state(false);

  let goWorkers: Worker[] = [];
  let goReadyCount = $state(0);
  let goCounts: number[] = $state([]);
  let goTokenCounts: number[] = $state([]);

  function fmt(n: number) {
    return n.toLocaleString('en-US').replace(/,/g, ' ');
  }

  const jsRate = $derived(jsElapsedMs > 0 ? Math.round(jsCount / (jsElapsedMs / 1000)) : 0);
  const goRate = $derived(goElapsedMs > 0 ? Math.round(goCount / (goElapsedMs / 1000)) : 0);
  const ratio = $derived(jsRate > 0 ? goRate / jsRate : 0);

  function sumGoCounts() {
    let c = 0;
    let tk = 0;
    for (let i = 0; i < goCounts.length; i++) {
      c += goCounts[i] || 0;
      tk += goTokenCounts[i] || 0;
    }
    goCount = c;
    goTokens = tk;
  }

  function clearPhaseTimer() {
    if (phaseTimer) clearInterval(phaseTimer);
    phaseTimer = null;
  }

  function disposeWorkers() {
    jsWorker?.terminate();
    jsWorker = null;
    jsReady = false;
    for (const w of goWorkers) w.terminate();
    goWorkers = [];
    goReadyCount = 0;
    goCounts = [];
    goTokenCounts = [];
  }

  async function ensureWorkers(): Promise<boolean> {
    if (jsReady && goReadyCount === workerCount && goWorkers.length === workerCount) return true;
    disposeWorkers();
    phase = 'loading';
    errorText = '';

    try {
      jsWorker = new Worker('/bench-js-worker.js');
      jsWorker.onmessage = (e) => {
        const m = e.data;
        if (m.type === 'ready') jsReady = true;
        else if (m.type === 'count') {
          jsCount = m.count;
          jsTokens = m.tokens ?? 0;
        } else if (m.type === 'error') {
          phase = 'error';
          errorText = `JS worker @${m.where ?? '?'}: ${m.error}`;
        }
      };
      jsWorker.onerror = (e) => {
        phase = 'error';
        errorText = `JS worker crashed: ${e.message || 'unknown'}`;
      };

      goCounts = new Array(workerCount).fill(0);
      goTokenCounts = new Array(workerCount).fill(0);
      for (let i = 0; i < workerCount; i++) {
        const w = new Worker('/bench-go-worker.js');
        const idx = i;
        w.onmessage = (e) => {
          const m = e.data;
          if (m.type === 'ready') goReadyCount += 1;
          else if (m.type === 'count') {
            goCounts[idx] = m.count;
            goTokenCounts[idx] = m.tokens ?? 0;
            sumGoCounts();
          } else if (m.type === 'error') {
            phase = 'error';
            errorText = `Go worker #${idx} @${m.where ?? '?'}: ${m.error}`;
          }
        };
        w.onerror = (e) => {
          phase = 'error';
          errorText = `Go worker #${idx} crashed: ${e.message || 'unknown'}`;
        };
        goWorkers.push(w);
      }
    } catch (err) {
      phase = 'error';
      errorText = err instanceof Error ? err.message : String(err);
      return false;
    }

    const t0 = performance.now();
    while (
      (!jsReady || goReadyCount < workerCount) &&
      (phase as string) !== 'error' &&
      performance.now() - t0 < 30000
    ) {
      await new Promise((r) => setTimeout(r, 50));
    }
    if ((phase as string) === 'error') return false;
    if (!jsReady || goReadyCount < workerCount) {
      phase = 'error';
      errorText = `worker handshake timeout (js=${jsReady} go=${goReadyCount}/${workerCount})`;
      return false;
    }
    return true;
  }

  // Sleep that bails out if runId changes (Stop pressed / new run started).
  function sleepCancellable(ms: number, myRunId: number): Promise<boolean> {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = () => {
        if (myRunId !== runId) return resolve(false);
        if (performance.now() - start >= ms) return resolve(true);
        setTimeout(tick, 50);
      };
      tick();
    });
  }

  async function start() {
    const ok = await ensureWorkers();
    if (!ok) return;

    runId++;
    const myRunId = runId;

    jsCount = 0;
    jsTokens = 0;
    jsElapsedMs = 0;
    goCount = 0;
    goTokens = 0;
    goElapsedMs = 0;
    goCounts = new Array(workerCount).fill(0);
    goTokenCounts = new Array(workerCount).fill(0);

    phase = 'running';

    // ── JS lane (always single-threaded, mirrors the official client) ──
    activeLane = 'js';
    const jsStart = performance.now();
    jsWorker?.postMessage({ type: 'start', noSleep: jsMode === 'fast' });
    clearPhaseTimer();
    phaseTimer = setInterval(() => {
      if (myRunId !== runId) return;
      jsElapsedMs = performance.now() - jsStart;
    }, 100);
    const jsFinished = await sleepCancellable(LANE_DURATION_MS, myRunId);
    clearPhaseTimer();
    jsWorker?.postMessage({ type: 'stop' });
    jsElapsedMs = performance.now() - jsStart;

    if (!jsFinished) {
      activeLane = null;
      phase = 'done';
      return;
    }

    // Tiny pause so the visitor sees the lane transition.
    await sleepCancellable(300, myRunId);
    if (myRunId !== runId) return;

    // ── Go lane (worker pool, mirrors SHMiner's goroutine pool) ──
    activeLane = 'go';
    const goStart = performance.now();
    for (let i = 0; i < goWorkers.length; i++) {
      // Each worker gets a 1B-apart nonce slice so token findings are
      // disjoint across the pool.
      goWorkers[i].postMessage({ type: 'start', nonceOffset: i * 1_000_000_000 });
    }
    clearPhaseTimer();
    phaseTimer = setInterval(() => {
      if (myRunId !== runId) return;
      goElapsedMs = performance.now() - goStart;
    }, 100);
    const goFinished = await sleepCancellable(LANE_DURATION_MS, myRunId);
    clearPhaseTimer();
    for (const w of goWorkers) w.postMessage({ type: 'stop' });
    goElapsedMs = performance.now() - goStart;

    activeLane = null;
    phase = goFinished ? 'done' : 'done';
  }

  function stop() {
    // Bumping runId is what triggers the awaits to bail out.
    runId++;
    jsWorker?.postMessage({ type: 'stop' });
    for (const w of goWorkers) w.postMessage({ type: 'stop' });
    clearPhaseTimer();
    activeLane = null;
    phase = 'done';
  }

  function pickWorkers(n: number) {
    if (phase === 'running') return;
    if (n > hwCores) return; // preset above hardware concurrency — refuse
    workerCount = n;
    customInput = '';
    customError = '';
    disposeWorkers();
    phase = 'idle';
  }

  function applyCustom() {
    if (phase === 'running') return;
    const n = parseInt(customInput, 10);
    if (!Number.isFinite(n) || n < 1) {
      customError = `1 — ${hwCores}`;
      return;
    }
    if (n > hwCores) {
      // Refuse anything above hardware concurrency — spinning more workers
      // than cores just slows everything down (context switching).
      customError = `${$t.bench.workersOverCore} (${hwCores})`;
      return;
    }
    customError = '';
    workerCount = n;
    disposeWorkers();
    phase = 'idle';
  }

  // Per-lane progress (0..1) while the lane is active.
  const jsProgress = $derived(activeLane === 'js' ? Math.min(1, jsElapsedMs / LANE_DURATION_MS) : (jsElapsedMs > 0 ? 1 : 0));
  const goProgress = $derived(activeLane === 'go' ? Math.min(1, goElapsedMs / LANE_DURATION_MS) : (goElapsedMs > 0 ? 1 : 0));

  onMount(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
      hwCores = navigator.hardwareConcurrency;
      const def = Math.min(8, Math.max(2, Math.floor(hwCores / 2)));
      workerCount = WORKER_OPTIONS.reduce((best, opt) =>
        Math.abs(opt - def) < Math.abs(best - def) ? opt : best
      );
      if (workerCount > hwCores) workerCount = hwCores;
    }
    return () => {
      runId++;
      disposeWorkers();
      clearPhaseTimer();
    };
  });
</script>

<section id="bench" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-10">
        <span class="font-mono text-sm text-emerald-300">// benchmark.bench</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.bench.title}</h2>
        <p class="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-muted)]">{$t.bench.subtitle}</p>
      </div>
    </Reveal>

    <Reveal>
      <div class="glass-strong border-gradient relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <!-- Control row -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-wider">
            {#if phase === 'idle'}
              <span class="text-[var(--color-muted)]">●</span>
              <span class="text-[var(--color-muted)]">{$t.bench.ready}</span>
            {:else if phase === 'loading'}
              <Loader2 class="h-3.5 w-3.5 animate-spin text-cyan-300" />
              <span class="text-cyan-300">{$t.bench.loading}</span>
            {:else if phase === 'running' && activeLane === 'js'}
              <span class="text-amber-300 motion-safe:animate-pulse">●</span>
              <span class="text-amber-300">{$t.bench.runningJs}</span>
            {:else if phase === 'running' && activeLane === 'go'}
              <span class="text-cyan-300 motion-safe:animate-pulse">●</span>
              <span class="text-cyan-300">{$t.bench.runningGo}</span>
            {:else if phase === 'done'}
              <span class="text-emerald-300">●</span>
              <span class="text-emerald-300">{$t.bench.done}</span>
            {:else if phase === 'error'}
              <AlertTriangle class="h-3.5 w-3.5 text-red-300" />
              <span class="text-red-300">{$t.bench.errorTitle}</span>
            {/if}

            {#if phase === 'running' && activeLane}
              <span class="text-[var(--color-muted)]">·</span>
              <span class="text-[var(--color-muted)]">
                {((activeLane === 'js' ? jsElapsedMs : goElapsedMs) / 1000).toFixed(1)} / {LANE_DURATION_MS / 1000}{$t.bench.elapsedSec}
              </span>
            {/if}
          </div>

          <div class="flex items-center gap-2">
            {#if phase !== 'running'}
              <button
                type="button"
                onclick={start}
                disabled={phase === 'loading'}
                class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-black shadow-md shadow-emerald-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {#if phase === 'loading'}
                  <Loader2 class="h-3.5 w-3.5 animate-spin" />
                {:else}
                  <Play class="h-3.5 w-3.5" />
                {/if}
                {phase === 'done' ? $t.bench.startAgain : $t.bench.start}
              </button>
            {:else}
              <button
                type="button"
                onclick={stop}
                class="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Square class="h-3.5 w-3.5" />
                {$t.bench.stop}
              </button>
            {/if}
          </div>
        </div>

        <!-- Worker count selector -->
        <div class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <span class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
            {$t.bench.workersLabel}
          </span>
          <div class="flex flex-wrap gap-1.5">
            {#each WORKER_OPTIONS as n}
              <button
                type="button"
                onclick={() => pickWorkers(n)}
                disabled={phase === 'running' || n > hwCores}
                title={n > hwCores ? `${$t.bench.workersOverCore} (${hwCores})` : ''}
                class="rounded-full px-3 py-1 font-mono text-[12px] transition disabled:cursor-not-allowed disabled:opacity-40 {workerCount === n && !customInput
                  ? 'bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40'
                  : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]'}"
              >
                {n}
              </button>
            {/each}
          </div>

          <!-- Custom input — clamped at hwCores -->
          <div class="flex items-center gap-1.5">
            <input
              type="number"
              min="1"
              max={hwCores}
              step="1"
              inputmode="numeric"
              placeholder={$t.bench.workersCustom}
              bind:value={customInput}
              disabled={phase === 'running'}
              onkeydown={(e) => { if (e.key === 'Enter') applyCustom(); }}
              aria-label={$t.bench.workersCustom}
              class="w-16 sm:w-24 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[12px] text-white/90 placeholder:text-white/30 focus:border-cyan-400/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
            <button
              type="button"
              onclick={applyCustom}
              disabled={phase === 'running' || !customInput}
              class="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[12px] text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {$t.bench.workersApply}
            </button>
            {#if customError}
              <span class="font-mono text-[11px] text-red-300">{customError}</span>
            {/if}
          </div>

          <span class="font-mono text-[11px] text-[var(--color-muted)]">
            · {$t.bench.detectedCores}: {hwCores} · {$t.bench.workersActive}: {workerCount}
          </span>
        </div>

        <!-- JS-lane mode toggle: verbatim official vs throttle-removed -->
        <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <span class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
            {$t.bench.jsModeLabel}
          </span>
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              onclick={() => (jsMode = 'original')}
              disabled={phase === 'running'}
              class="rounded-full px-3 py-1 font-mono text-[12px] transition disabled:cursor-not-allowed disabled:opacity-40 {jsMode === 'original'
                ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40'
                : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]'}"
            >
              ⏱ {$t.bench.jsModeOriginal}
            </button>
            <button
              type="button"
              onclick={() => (jsMode = 'fast')}
              disabled={phase === 'running'}
              class="rounded-full px-3 py-1 font-mono text-[12px] transition disabled:cursor-not-allowed disabled:opacity-40 {jsMode === 'fast'
                ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40'
                : 'border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06]'}"
            >
              ⚡ {$t.bench.jsModeFast}
            </button>
          </div>
          <span class="font-mono text-[11px] text-[var(--color-muted)]">
            · {jsMode === 'original' ? $t.bench.jsModeOriginalHint : $t.bench.jsModeFastHint}
          </span>
        </div>

        {#if phase === 'error' && errorText}
          <div class="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 font-mono text-xs leading-relaxed text-red-200">
            <div class="font-semibold">⚠ {$t.bench.errorTitle}</div>
            <div class="mt-1 break-all opacity-90">{errorText}</div>
          </div>
        {/if}

        <!-- Two lanes (sequential — active one is lit, inactive is dimmed) -->
        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <!-- JS lane -->
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition {phase === 'running' && activeLane !== 'js' ? 'opacity-50' : ''}"
          >
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-300 via-orange-400 to-red-400"></div>
            <!-- Progress bar -->
            {#if jsProgress > 0 && jsProgress < 1}
              <div
                class="absolute inset-x-0 top-0 h-[2px] bg-amber-300/80 transition-all"
                style="width: {Math.round(jsProgress * 100)}%"
              ></div>
            {/if}
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 text-amber-200/90">
                <Cpu class="h-4 w-4" />
                <span class="font-mono text-xs uppercase tracking-wider">{$t.bench.labelJs}</span>
              </div>
              <span class="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">
                ×1 · {jsMode === 'original' ? $t.bench.jsModeOriginalTag : $t.bench.jsModeFastTag}
                {#if phase === 'running' && activeLane === 'js'}
                  · {$t.bench.live}
                {/if}
              </span>
            </div>
            <div class="mt-4 font-mono text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl">
              {jsCount > 0 ? fmt(jsRate) : '—'}
            </div>
            <div class="mt-1 font-mono text-xs text-[var(--color-muted)]">{$t.bench.hashrate}</div>

            <div class="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 font-mono text-[11px]">
              <div>
                <div class="text-[var(--color-muted)] uppercase tracking-wider">{$t.bench.tokensLabel}</div>
                <div class="mt-1 text-2xl font-bold tabular-nums text-amber-200">{jsCount > 0 ? fmt(jsTokens) : '—'}</div>
              </div>
              <div>
                <div class="text-[var(--color-muted)] uppercase tracking-wider">{$t.bench.hashesLabel}</div>
                <div class="mt-1 text-sm tabular-nums text-white/80">{jsCount > 0 ? fmt(jsCount) : '—'}</div>
              </div>
            </div>
          </div>

          <!-- Go lane -->
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition {phase === 'running' && activeLane !== 'go' ? 'opacity-50' : ''}"
          >
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-300 via-violet-400 to-fuchsia-500"></div>
            {#if goProgress > 0 && goProgress < 1}
              <div
                class="absolute inset-x-0 top-0 h-[2px] bg-cyan-300/80 transition-all"
                style="width: {Math.round(goProgress * 100)}%"
              ></div>
            {/if}
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 text-cyan-200/90">
                <Zap class="h-4 w-4" />
                <span class="font-mono text-xs uppercase tracking-wider">{$t.bench.labelGo}</span>
              </div>
              <span class="font-mono text-[10px] uppercase tracking-wider text-cyan-200/80">
                ×{workerCount}
                {#if phase === 'running' && activeLane === 'go'}
                  · {$t.bench.live}
                {/if}
              </span>
            </div>
            <div class="mt-4 font-mono text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl">
              {goCount > 0 ? fmt(goRate) : '—'}
            </div>
            <div class="mt-1 font-mono text-xs text-[var(--color-muted)]">{$t.bench.hashrate}</div>

            <div class="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 font-mono text-[11px]">
              <div>
                <div class="text-[var(--color-muted)] uppercase tracking-wider">{$t.bench.tokensLabel}</div>
                <div class="mt-1 text-2xl font-bold tabular-nums text-cyan-200">{goCount > 0 ? fmt(goTokens) : '—'}</div>
              </div>
              <div>
                <div class="text-[var(--color-muted)] uppercase tracking-wider">{$t.bench.hashesLabel}</div>
                <div class="mt-1 text-sm tabular-nums text-white/80">{goCount > 0 ? fmt(goCount) : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ratio readout — only meaningful once both lanes have data -->
        {#if ratio > 0 && jsElapsedMs > 0 && goElapsedMs > 0}
          <div class="mt-8 flex flex-col items-center text-center">
            <div class="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {$t.bench.speedupLabel}
            </div>
            <div class="mt-2 font-mono text-6xl font-bold tracking-tight sm:text-7xl">
              <span class="text-gradient">{ratio < 10 ? ratio.toFixed(1) : Math.round(ratio)}×</span>
            </div>
            <div class="mt-2 max-w-md font-mono text-xs text-[var(--color-muted)]">
              {$t.bench.speedupBody}
            </div>
          </div>
        {/if}

        <p class="mt-6 max-w-3xl font-mono text-[11px] leading-relaxed text-[var(--color-muted)]/80">
          ⓘ {$t.bench.disclaimer}
        </p>

        <!-- Desktop-client CTA. The browser is a demo; the real numbers
             only happen on the native Wails build. -->
        <div class="mt-6 grid items-center gap-4 rounded-2xl border border-violet-400/25 bg-violet-500/5 p-5 md:grid-cols-[1fr_auto]">
          <div>
            <div class="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-violet-200">
              <Cpu class="h-3.5 w-3.5" />
              {$t.bench.desktopNoteTitle}
            </div>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
              {$t.bench.desktopNoteBody}
            </p>
          </div>
          <a
            href="https://github.com/OlexiyOdarchuk/Student-Hryvnia-Miner/releases"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/30 transition hover:brightness-110"
          >
            <Download class="h-4 w-4" />
            {$t.bench.desktopCta}
            <ExternalLink class="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </Reveal>
  </div>
</section>
