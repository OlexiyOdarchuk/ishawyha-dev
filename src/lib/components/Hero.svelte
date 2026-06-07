<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { ArrowRight, Mail, Github, Sparkles, FileDown } from 'lucide-svelte';

  const badgeOrder = ['best', 'mate', 'dou'] as const;

  const badgeAccents: Record<(typeof badgeOrder)[number], string> = {
    best: 'text-amber-200/80',
    mate: 'text-pink-200/80',
    dou: 'text-violet-200/80'
  };
</script>

<section class="relative px-6 pt-16 pb-12 sm:pt-24 sm:pb-20">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <!-- Status pill -->
      <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
        </span>
        {$t.hero.available}
      </div>

      <!-- Name + role -->
      <h1 class="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-[5.5rem]">
        <span class="text-gradient">{$t.hero.name}</span>
      </h1>

      <p class="mt-4 font-mono text-lg text-[var(--color-muted)] sm:text-xl">
        <span class="text-violet-300">$</span> {$t.hero.role}
      </p>

      <p class="mt-8 max-w-2xl text-2xl leading-snug text-white/85 sm:text-3xl">
        {$t.hero.tagline}
      </p>

      <p class="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
        {$t.hero.intro}
      </p>
    </Reveal>

    <Reveal delay={120}>
      <!-- CTAs -->
      <div class="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="/lab"
          class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-violet-500/30 transition hover:shadow-pink-500/40 hover:brightness-110"
        >
          <Sparkles class="h-4 w-4" />
          {$t.hero.ctaPrimary}
          <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>

        <a
          href="/services"
          class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:border-white/25 hover:bg-white/10"
        >
          <Mail class="h-4 w-4" />
          {$t.hero.ctaSecondary}
        </a>

        <a
          href="https://github.com/OlexiyOdarchuk"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-[var(--color-muted)] transition hover:border-white/20 hover:text-white"
        >
          <Github class="h-4 w-4" />
          {$t.hero.ctaGithub}
        </a>
      </div>

      <!-- Now strip — a live "what I'm currently doing" line -->
      <div class="mt-6 inline-flex max-w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-white/10 bg-white/[0.025] px-3.5 py-2 text-sm text-white/85 backdrop-blur-sm">
        <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">{$t.hero.nowLabel}</span>
        <span class="text-white/85">
          {#each $t.hero.nowItems as item, i}{item}{#if i < $t.hero.nowItems.length - 1}<span class="mx-2 text-[var(--color-muted)]">·</span>{/if}{/each}
        </span>
      </div>

      <!-- CV download row -->
      <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
        <span class="font-mono uppercase tracking-wider">{$t.hero.cvLabel}</span>
        <a
          href="/CV_Odarchuk_UA.pdf"
          download
          class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-amber-300/40 hover:bg-amber-300/5 hover:text-amber-200"
        >
          <FileDown class="h-3.5 w-3.5" />
          {$t.hero.cvUa}
        </a>
        <a
          href="/CV_Odarchuk_EN.pdf"
          download
          class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-amber-300/40 hover:bg-amber-300/5 hover:text-amber-200"
        >
          <FileDown class="h-3.5 w-3.5" />
          {$t.hero.cvEn}
        </a>
      </div>
    </Reveal>

    <!-- Glass badge cards -->
    <div class="mt-14 grid gap-4 sm:grid-cols-3">
      {#each badgeOrder as key, i}
        {@const badge = $t.hero.badges[key]}
        <Reveal delay={200 + i * 80}>
          <div class="glass border-gradient relative h-full overflow-hidden rounded-2xl p-5 transition hover:translate-y-[-2px]">
            <div class="text-2xl">{badge.emoji}</div>
            <div class="mt-2 text-xs font-mono uppercase tracking-wider {badgeAccents[key]}">{badge.label}</div>
            <div class="mt-1 text-base font-semibold text-white">{badge.title}</div>
            <div class="mt-1 text-sm text-[var(--color-muted)]">{badge.subtitle}</div>
          </div>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
