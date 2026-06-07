<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';

  // showHeader is turned off when a PageHero already titles the page.
  let { showHeader = true }: { showHeader?: boolean } = $props();
</script>

<section id="about" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    {#if showHeader}
      <Reveal>
        <div class="mb-10">
          <span class="font-mono text-sm text-violet-400">// Hello World!</span>
          <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.about.title}</h2>
        </div>
      </Reveal>
    {/if}

    <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <Reveal delay={80}>
        <div class="glass rounded-3xl p-8 sm:p-10">
          <p class="text-lg leading-relaxed text-white/85">{$t.about.p1}</p>
          <div class="my-6 h-px w-16 bg-gradient-to-r from-violet-400 to-transparent"></div>
          <p class="text-base leading-relaxed text-[var(--color-muted)]">{$t.about.p2}</p>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <ul class="grid grid-cols-2 gap-3">
          {#each $t.about.facts as fact, i}
            <li class="glass flex flex-col gap-1 rounded-2xl p-5">
              <span class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">{fact.label}</span>
              <span class="text-sm font-medium text-white/90">{fact.value}</span>
            </li>
          {/each}
        </ul>
      </Reveal>
    </div>
  </div>
</section>
