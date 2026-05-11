<script lang="ts">
  import { onMount } from 'svelte';

  // Pause expensive blob animations when the page isn't visible (off-tab or
  // way past the hero). Saves real CPU on long scrolls and idle backgrounds.
  let host: HTMLDivElement | null = $state(null);
  let running = $state(true);

  onMount(() => {
    if (!host) return;
    const visTarget = document.getElementById('top');
    if (!visTarget || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0]?.isIntersecting ?? true;
      },
      // generous root margin — keep blobs running while hero + first sections are near.
      { rootMargin: '120% 0px 120% 0px' }
    );
    io.observe(visTarget);

    const onVisibility = () => {
      // Hard pause if the whole tab is hidden.
      if (document.hidden) running = false;
      else running = (visTarget.getBoundingClientRect().bottom > -window.innerHeight * 1.2);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });
</script>

<div
  bind:this={host}
  class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
  class:is-paused={!running}
  aria-hidden="true"
>
  <!-- Base radial -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]"></div>
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10),transparent_60%)]"></div>

  <!-- Grid lines -->
  <div
    class="absolute inset-0 opacity-[0.06]"
    style="background-image:
      linear-gradient(to right, #ffffff 1px, transparent 1px),
      linear-gradient(to bottom, #ffffff 1px, transparent 1px);
      background-size: 64px 64px;
      mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%);
      -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 80%);"
  ></div>

  <!-- Blob 1 — violet -->
  <div
    class="animate-blob-1 absolute -top-32 -left-24 h-[42rem] w-[42rem] rounded-full opacity-50 blur-3xl"
    style="background: radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 65%);"
  ></div>

  <!-- Blob 2 — pink -->
  <div
    class="animate-blob-2 absolute top-1/4 right-[-10rem] h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl"
    style="background: radial-gradient(circle, rgba(244,114,182,0.5) 0%, transparent 65%);"
  ></div>

  <!-- Blob 3 — amber -->
  <div
    class="animate-blob-3 absolute top-[55%] left-1/4 h-[32rem] w-[32rem] rounded-full opacity-30 blur-3xl"
    style="background: radial-gradient(circle, rgba(252,211,77,0.45) 0%, transparent 65%);"
  ></div>

  <!-- Cyan accent for lab section -->
  <div
    class="animate-blob-3 absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full opacity-30 blur-3xl"
    style="background: radial-gradient(circle, rgba(34,211,238,0.35) 0%, transparent 65%);"
  ></div>

  <!-- Subtle noise overlay -->
  <svg class="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
</div>

<style>
  .is-paused :global([class*='animate-blob']) {
    animation-play-state: paused;
  }
</style>
