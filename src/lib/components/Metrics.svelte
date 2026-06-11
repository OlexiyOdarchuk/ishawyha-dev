<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { onMount } from 'svelte';

  type Item = { value: number; suffix: string; label: string };

  let host: HTMLDivElement | null = $state(null);
  let started = $state(false);
  let shown = $state<number[]>([]);

  onMount(() => {
    const items = $t.home.metrics.items as Item[];
    shown = items.map(() => 0);

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !host || typeof IntersectionObserver === 'undefined') {
      shown = items.map((m) => m.value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const dur = 1100;
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          shown = items.map((m) => Math.round(m.value * eased));
          if (k < 1) requestAnimationFrame(tick);
          else shown = items.map((m) => m.value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(host);
    return () => io.disconnect();
  });

  function fmt(n: number): string {
    return n >= 1000 ? n.toLocaleString('en-US').replace(/,/g, ' ') : String(n);
  }
</script>

<section class="relative px-6 py-10">
  <div class="mx-auto max-w-6xl" bind:this={host}>
    <Reveal>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {#each $t.home.metrics.items as item, i}
          <div class="card p-5">
            <div class="display text-3xl text-[var(--color-accent-500)] tabular-nums sm:text-4xl">
              {fmt(shown[i] ?? 0)}<span class="text-[var(--color-fg)]">{item.suffix}</span>
            </div>
            <div class="mt-2 text-xs leading-snug text-[var(--color-muted)]">{item.label}</div>
          </div>
        {/each}
      </div>
    </Reveal>
  </div>
</section>
