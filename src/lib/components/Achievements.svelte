<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import DouLogo from './DouLogo.svelte';

  const order = ['best', 'mate', 'dou', 'security'] as const;

  // Per-win color scheme + headline accolade. `dou` renders the DOU logo.
  const scheme: Record<(typeof order)[number], { folio: string; bg: string; line: string; fg: string }> = {
    best:     { folio: '1ST',   bg: 'var(--color-gold-bg)',    line: 'var(--color-gold-line)',    fg: 'var(--color-gold)' },
    mate:     { folio: '3RD',   bg: 'var(--color-rose-bg)',    line: 'var(--color-rose-line)',    fg: 'var(--color-rose)' },
    dou:      { folio: '',      bg: 'var(--color-indigo-bg)',  line: 'var(--color-indigo-line)',  fg: 'var(--color-accent-500)' },
    security: { folio: '1000×', bg: 'var(--color-emerald-bg)', line: 'var(--color-emerald-line)', fg: 'var(--color-emerald)' }
  };
</script>

<section id="achievements" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-8">
        <span class="kicker">// achievements</span>
        <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.achievements.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.achievements.subtitle}</p>
      </div>
    </Reveal>

    <div class="grid gap-4 md:grid-cols-2">
      {#each order as key, i}
        {@const item = $t.achievements.items[key]}
        {@const s = scheme[key]}
        <Reveal delay={i * 80}>
          <article class="card card-hover h-full overflow-hidden p-6">
            <div class="flex items-start gap-4">
              <div class="grid shrink-0 place-items-center rounded-xl px-3 py-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                   style="background: {s.bg}; border: 1px solid {s.line}; color: {s.fg};">
                {#if key === 'dou'}<DouLogo size={30} />{:else}{s.folio}{/if}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span class="font-mono text-[11px] font-semibold tracking-wider uppercase" style="color: {s.fg};">{item.label}</span>
                  <span class="font-mono text-xs text-[var(--color-muted)]">{item.date}</span>
                </div>
                <h3 class="mt-1.5 text-xl font-bold text-[var(--color-fg)]">{item.title}</h3>
                <p class="text-sm font-medium text-[var(--color-muted)]">{item.company}</p>
              </div>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-[var(--color-body)]">{item.description}</p>

            <ul class="mt-4 flex flex-wrap gap-1.5">
              {#each item.tags as tag}
                <li class="tag">{tag}</li>
              {/each}
            </ul>

            {#if key === 'security'}
              <a href="#bench" class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-400)]/40 bg-[var(--color-accent-400)]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[var(--color-accent-500)] uppercase transition hover:bg-[var(--color-accent-400)]/20">
                ⚡ {$t.achievements.benchLink}
              </a>
            {/if}
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
