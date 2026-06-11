<script lang="ts">
  import { onMount } from 'svelte';

  type Token = { text: string; cls?: string };
  type Props = {
    /** Each inner array is a line; lines are joined with \n during typing. */
    lines: Token[][];
    /** Total animation duration in ms. */
    durationMs?: number;
    /** Visibility threshold for IntersectionObserver. */
    threshold?: number;
  };

  let { lines, durationMs = 4200, threshold = 0.25 }: Props = $props();

  const total = $derived(
    lines.reduce((sum, line) => sum + line.reduce((s, t) => s + t.text.length, 0) + 1, 0)
  );

  let typed = $state(0);
  let started = $state(false);
  let el: HTMLPreElement | null = $state(null);

  // Slice tokens up to `max` characters; tokens before are kept whole,
  // the one that straddles the boundary is truncated.
  function take(max: number): Token[][] {
    let used = 0;
    const out: Token[][] = [];
    for (const line of lines) {
      if (used >= max) break;
      const row: Token[] = [];
      for (const t of line) {
        if (used >= max) break;
        const remaining = max - used;
        if (t.text.length <= remaining) {
          row.push(t);
          used += t.text.length;
        } else {
          row.push({ ...t, text: t.text.slice(0, remaining) });
          used = max;
        }
      }
      out.push(row);
      used += 1; // newline
      if (used > max) used = max;
    }
    return out;
  }

  const visible = $derived(take(typed));
  // Cursor sits at the end of the currently-typed substring while still typing.
  const cursorActive = $derived(typed > 0 && typed < total);

  onMount(() => {
    if (!el) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      typed = total;
      started = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            const startedAt = performance.now();
            const tick = (now: number) => {
              const k = Math.min(1, (now - startedAt) / durationMs);
              typed = Math.floor(k * total);
              if (k < 1) requestAnimationFrame(tick);
              else typed = total;
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<pre bind:this={el} class="overflow-x-auto p-4 text-[var(--color-ink-fg)]"><code>{#each visible as line, lineIdx}{#each line as tok}<span class={tok.cls ?? ''}>{tok.text}</span>{/each}{#if lineIdx < visible.length - 1}{'\n'}{/if}{/each}{#if cursorActive}<span class="typer-caret">▍</span>{/if}</code></pre>

<style>
  .typer-caret {
    display: inline-block;
    margin-left: 1px;
    color: var(--color-accent-400);
    animation: caret-blink 0.9s steps(2, start) infinite;
  }
  @keyframes caret-blink {
    to { opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .typer-caret { animation: none; }
  }
</style>
