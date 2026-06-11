<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import DouLogo from './DouLogo.svelte';
  import { ArrowRight, Mail, Github, FileDown, Sparkles } from 'lucide-svelte';

  const badgeOrder = ['best', 'mate', 'dou'] as const;
  const badgeAccent: Record<(typeof badgeOrder)[number], string> = {
    best: 'text-[var(--color-gold)]',
    mate: 'text-[var(--color-rose)]',
    dou: 'text-[var(--color-accent-500)]'
  };
</script>

<section class="relative px-6 pt-28 pb-12 sm:pt-32">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <!-- Status pill -->
      <div class="mb-7 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" style="border-color: var(--color-emerald-line); background: var(--color-emerald-bg); color: var(--color-emerald);">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full" style="background: var(--color-emerald);"></span>
        </span>
        {$t.hero.available}
      </div>

      <h1 class="display text-5xl text-[var(--color-fg)] sm:text-7xl md:text-[5rem]">
        {$t.hero.nameLine1} {$t.hero.nameLine2}<span class="text-[var(--color-accent-400)]">.</span>
      </h1>
      <p class="mt-4 text-lg font-semibold text-[var(--color-accent-500)] sm:text-xl">
        <span class="font-mono text-[var(--color-accent-400)]">~$</span> {$t.hero.role}
      </p>

      <p class="mt-7 max-w-2xl text-xl leading-snug font-medium text-[var(--color-fg)] sm:text-2xl">{$t.hero.tagline}</p>
      <p class="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">{$t.hero.intro}</p>
    </Reveal>

    <Reveal delay={120}>
      <!-- Hire-me highlight (amber, як у CV) -->
      <p class="mt-6 max-w-2xl rounded-xl border border-[var(--color-gold-line)] bg-[var(--color-gold-bg)] px-4 py-2.5 text-sm font-medium text-[var(--color-gold)]">
        {$t.hero.hireLine}
      </p>

      <div class="mt-6 flex flex-wrap items-center gap-3">
        <a href="/lab" onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_hero_primary')} class="btn-primary group">
          <Sparkles class="h-4 w-4" />
          {$t.hero.ctaPrimary}
          <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>
        <a href="/services" onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_hero_services')} class="btn-secondary">
          <Mail class="h-4 w-4" />
          {$t.hero.ctaSecondary}
        </a>
        <a href="https://github.com/OlexiyOdarchuk" target="_blank" rel="noopener noreferrer" onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_hero_github')} class="btn-ghost">
          <Github class="h-4 w-4" />
          {$t.hero.ctaGithub}
        </a>
      </div>

      <!-- Now + CV -->
      <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div class="inline-flex items-baseline gap-2.5 text-sm">
          <span class="font-mono text-[10px] tracking-[0.16em] text-[var(--color-accent-500)] uppercase">{$t.hero.nowLabel}</span>
          <span class="text-[var(--color-body)]">
            {#each $t.hero.nowItems as item, i}{item}{#if i < $t.hero.nowItems.length - 1}<span class="mx-1.5 text-[var(--color-muted)]">·</span>{/if}{/each}
          </span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="font-mono tracking-wider text-[var(--color-muted)] uppercase">{$t.hero.cvLabel}</span>
          <a href="/CV_Odarchuk_UA.pdf" download onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'download_cv_ua')} class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 font-mono text-xs font-medium text-[var(--color-body)] transition hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-500)]">
            <FileDown class="h-3.5 w-3.5" />{$t.hero.cvUa}
          </a>
          <a href="/CV_Odarchuk_EN.pdf" download onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'download_cv_en')} class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1 font-mono text-xs font-medium text-[var(--color-body)] transition hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-500)]">
            <FileDown class="h-3.5 w-3.5" />{$t.hero.cvEn}
          </a>
        </div>
      </div>
    </Reveal>

    <!-- Wins as cards -->
    <div class="mt-12 grid gap-4 sm:grid-cols-3">
      {#each badgeOrder as key, i}
        {@const badge = $t.hero.badges[key]}
        <Reveal delay={200 + i * 80}>
          <div class="card card-hover h-full p-5">
            <div class="flex items-start justify-between">
              <div class="text-2xl {badgeAccent[key]}">
                {#if key === 'dou'}<DouLogo size={26} />{:else}{badge.emoji}{/if}
              </div>
              <div class="font-mono text-[11px] font-semibold tracking-wider uppercase {badgeAccent[key]}">{badge.label}</div>
            </div>
            <div class="mt-3 text-base font-bold text-[var(--color-fg)]">{badge.title}</div>
            <div class="mt-0.5 text-sm text-[var(--color-muted)]">{badge.subtitle}</div>
          </div>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
