<script lang="ts">
  import Reveal from './Reveal.svelte';

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

<section class="relative px-6 pt-32 pb-10 sm:pt-36 sm:pb-14">
  <div class="relative mx-auto max-w-6xl">
    <Reveal>
      {#if kicker}
        <span class="kicker mb-4">{kicker}</span>
      {/if}
      <h1 class="display text-5xl text-[var(--color-fg)] sm:text-6xl md:text-7xl">{title}</h1>
      {#if subtitle}
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-body)]">{subtitle}</p>
      {/if}
      {#if children}
        <div class="mt-8">{@render children()}</div>
      {/if}
    </Reveal>
  </div>
</section>
