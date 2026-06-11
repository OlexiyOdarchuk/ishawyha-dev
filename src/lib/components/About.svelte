<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';

  let { showHeader = true }: { showHeader?: boolean } = $props();
</script>

<section id="about" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    {#if showHeader}
      <Reveal>
        <div class="mb-8">
          <span class="kicker">// about</span>
          <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.about.title}</h2>
        </div>
      </Reveal>
    {/if}

    <div class="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Reveal delay={80}>
        <div class="card h-full p-7 sm:p-8">
          <p class="text-lg leading-relaxed text-[var(--color-fg)]">{$t.about.p1}</p>
          <p class="mt-4 text-base leading-relaxed text-[var(--color-muted)]">{$t.about.p2}</p>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <ul class="grid h-full grid-cols-2 gap-3">
          {#each $t.about.facts as fact}
            <li class="card flex flex-col gap-1 p-4">
              <span class="font-mono text-[10px] tracking-[0.14em] text-[var(--color-accent-500)] uppercase">{fact.label}</span>
              <span class="text-sm font-semibold text-[var(--color-fg)]">{fact.value}</span>
            </li>
          {/each}
        </ul>
      </Reveal>
    </div>
  </div>
</section>
