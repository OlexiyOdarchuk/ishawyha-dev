<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { GraduationCap } from 'lucide-svelte';
</script>

<section id="education" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-10">
        <span class="font-mono text-sm text-emerald-300">// education/</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.education.title}</h2>
      </div>
    </Reveal>

    <div class="grid gap-5 md:grid-cols-2">
      {#each Object.entries($t.education.items) as [key, item], i}
        <Reveal delay={i * 80}>
          <article class="glass relative flex h-full items-start gap-4 rounded-3xl p-6">
            <span
              class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 text-violet-200"
            >
              <GraduationCap class="h-5 w-5" />
            </span>
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-semibold text-white">{item.title}</h3>
                <span class="font-mono text-xs whitespace-nowrap text-[var(--color-muted)]">{item.date}</span>
              </div>
              <p class="text-sm text-[var(--color-muted)]">{item.place}</p>
              {#if 'note' in item && item.note}
                <p class="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-violet-200">
                  {item.note}
                </p>
              {/if}
            </div>
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
