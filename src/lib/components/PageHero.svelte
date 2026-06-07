<script lang="ts">
  import Reveal from './Reveal.svelte';

  // Consistent header band for sub-pages. Dark by design — it sits over the
  // global animated Background, anchoring each route before its content.
  let {
    kicker = '',
    title,
    subtitle = '',
    children
  }: {
    kicker?: string;
    title: string;
    subtitle?: string;
    children?: import('svelte').Snippet;
  } = $props();
</script>

<section class="relative px-6 pt-28 pb-14 sm:pt-32 sm:pb-20">
  <!-- Localized glow so the band reads as a header without a hard edge -->
  <div class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-full overflow-hidden">
    <div class="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>
    <div class="absolute -top-10 right-1/4 h-64 w-64 rounded-full bg-pink-500/15 blur-3xl"></div>
  </div>

  <div class="relative mx-auto max-w-6xl">
    <Reveal>
      {#if kicker}
        <span class="font-mono text-sm text-violet-300">{kicker}</span>
      {/if}
      <h1 class="display mt-3 text-5xl sm:text-6xl md:text-7xl">
        <span class="text-gradient">{title}</span>
      </h1>
      {#if subtitle}
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl">
          {subtitle}
        </p>
      {/if}
      {#if children}
        <div class="mt-8">{@render children()}</div>
      {/if}
    </Reveal>
  </div>
</section>
