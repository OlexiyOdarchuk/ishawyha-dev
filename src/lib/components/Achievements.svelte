<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';

  const order = ['best', 'mate', 'dou', 'security'] as const;

  const accents: Record<(typeof order)[number], string> = {
    best: 'from-amber-300 via-amber-400 to-orange-500',
    mate: 'from-pink-400 via-fuchsia-500 to-violet-500',
    dou: 'from-violet-400 via-indigo-500 to-cyan-400',
    security: 'from-emerald-400 via-teal-500 to-cyan-500'
  };

  // Headline number per win — scannable at a glance.
  const folio: Record<(typeof order)[number], { value: string; color: string }> = {
    best:     { value: '1ST',    color: 'text-amber-300' },
    mate:     { value: '3RD',    color: 'text-pink-300' },
    dou:      { value: '·',      color: 'text-violet-300' },
    security: { value: '1000×',  color: 'text-emerald-300' }
  };
</script>

<section id="achievements" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-12">
        <span class="font-mono text-sm text-pink-300">// achievements.json</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.achievements.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.achievements.subtitle}</p>
      </div>
    </Reveal>

    <div class="grid gap-5 md:grid-cols-2">
      {#each order as key, i}
        {@const item = $t.achievements.items[key]}
        <Reveal delay={i * 80}>
          <article
            class="glass group relative h-full overflow-hidden rounded-3xl p-7 transition hover:-translate-y-1 hover:bg-white/[0.06]"
          >
            <!-- top accent bar -->
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r {accents[key]} opacity-70"></div>

            <div class="flex items-start gap-4 sm:gap-5">
              <!-- Big folio number / accolade -->
              <div
                class="shrink-0 font-mono text-3xl font-bold leading-none tracking-tight sm:text-5xl {folio[key].color}"
                aria-hidden="true"
              >
                {folio[key].value}
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <span
                    class="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80"
                  >
                    {item.label}
                  </span>
                  <div class="font-mono text-xs whitespace-nowrap text-[var(--color-muted)]">{item.date}</div>
                </div>
                <h3 class="mt-3 text-xl font-semibold text-white">{item.title}</h3>
                <p class="mt-1 text-sm italic text-[var(--color-muted)]">{item.company}</p>
              </div>
            </div>

            <p class="mt-5 text-sm leading-relaxed text-white/80">{item.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each item.tags as tag}
                <li
                  class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/80"
                >
                  {tag}
                </li>
              {/each}
            </ul>
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
