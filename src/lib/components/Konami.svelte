<script lang="ts">
  // Classic up-up-down-down-left-right-left-right-B-A cheat code.
  // On match: rain of 🐍 emoji + Piton keywords for ~8 seconds, plus a
  // tiny toast in the bottom-right so the visitor knows it triggered.
  import { onMount } from 'svelte';

  const SEQUENCE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  const KEYWORDS = ['🐍', 'functia', 'drukuvaty', 'poky', 'yaksho', 'vernuty', 'slovnyk', 'dovzhyna'];

  let progress = 0; // matched prefix length
  let active = $state(false);
  let toastVisible = $state(false);
  let drops = $state<Array<{ left: number; delay: number; dur: number; text: string; size: number }>>([]);

  function spawn() {
    if (active) return;
    active = true;
    toastVisible = true;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const N = reduce ? 12 : 60;
    drops = Array.from({ length: N }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      dur: 4 + Math.random() * 4,
      text: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
      size: 18 + Math.floor(Math.random() * 26)
    }));
    setTimeout(() => (toastVisible = false), 3000);
    setTimeout(() => {
      active = false;
      drops = [];
    }, 9000);
  }

  function onKey(e: KeyboardEvent) {
    // Don't intercept when the visitor is typing into a field — the lab
    // editor takes plenty of arrow-key input and we shouldn't fight it.
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) {
      progress = 0;
      return;
    }
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const expected = SEQUENCE[progress];
    if (key === expected) {
      progress++;
      if (progress === SEQUENCE.length) {
        progress = 0;
        spawn();
      }
    } else {
      progress = key === SEQUENCE[0] ? 1 : 0;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if active}
  <div class="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
    {#each drops as d (d.left + ':' + d.delay)}
      <span
        class="konami-drop absolute top-[-10%] font-mono font-semibold text-emerald-300/90"
        style="left:{d.left}%; animation-delay:{d.delay}s; animation-duration:{d.dur}s; font-size:{d.size}px;"
      >
        {d.text}
      </span>
    {/each}
  </div>
{/if}

{#if toastVisible}
  <div
    class="pointer-events-none fixed bottom-6 right-6 z-[70] rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 font-mono text-xs text-emerald-200 shadow-lg shadow-emerald-500/20 backdrop-blur"
    role="status"
  >
    🐍 Konami unlocked · piton mode
  </div>
{/if}

<style>
  .konami-drop {
    animation-name: konami-fall;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    text-shadow: 0 0 8px rgba(110, 231, 183, 0.5);
    white-space: nowrap;
  }
  @keyframes konami-fall {
    0%   { transform: translateY(0) rotate(-4deg); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(120vh) rotate(8deg); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .konami-drop {
      animation-duration: 6s !important;
      animation-timing-function: ease-out;
    }
  }
</style>
