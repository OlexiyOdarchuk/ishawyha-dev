<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import TypewriterCode from './TypewriterCode.svelte';
  import { goto } from '$app/navigation';
  import { Github, ExternalLink, Sparkles, ArrowRight, Activity, Globe } from 'lucide-svelte';

  // 'full' = featured rombik + grid (used on /projects).
  // 'featured' = just the featured rombik card (used as a teaser on Home).
  // showHeader is turned off when a PageHero already titles the page.
  let { variant = 'full', showHeader = true }: { variant?: 'full' | 'featured'; showHeader?: boolean } =
    $props();

  function gotoBench(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    goto('/lab#bench');
  }

  // Projects with a live deployment — the card leads to the site, with a
  // secondary button to the source.
  const live: Partial<Record<(typeof order)[number], string>> = {
    piton: 'https://piton.ishawyha.dev'
  };

  function openExternal(e: MouseEvent, url: string) {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // The featured card previews the rombik input — the Python you paste in.
  const rombikSnippet = [
    [{ text: 'def ', cls: 'text-pink-300' }, { text: 'grade', cls: 'text-amber-200' }, { text: '(score):' }],
    [{ text: '    ' }, { text: 'if ', cls: 'text-pink-300' }, { text: 'score >= ' }, { text: '90', cls: 'text-cyan-300' }, { text: ':' }],
    [{ text: '        ' }, { text: 'print', cls: 'text-violet-300' }, { text: '(' }, { text: '"Відмінно"', cls: 'text-emerald-300' }, { text: ')' }],
    [{ text: '    ' }, { text: 'else', cls: 'text-pink-300' }, { text: ':' }],
    [{ text: '        ' }, { text: 'print', cls: 'text-violet-300' }, { text: '(' }, { text: '"Задовільно"', cls: 'text-emerald-300' }, { text: ')' }],
    [{ text: '    ' }, { text: 'return ', cls: 'text-pink-300' }, { text: 'score' }],
    [],
    [{ text: '# → блок-схема за ДСТУ 19.701-90', cls: 'text-white/30' }]
  ];

  const order = ['gomonobanksdk', 'monokasa', 'shminer', 'piton', 'abit', 'todolist', 'linkshortener'] as const;

  const links: Record<(typeof order)[number], string> = {
    gomonobanksdk: 'https://github.com/OlexiyOdarchuk/go-monobank-sdk',
    monokasa: 'https://github.com/OlexiyOdarchuk/monokasa',
    shminer: 'https://github.com/OlexiyOdarchuk/Student-Hryvnia-Miner',
    piton: 'https://github.com/OlexiyOdarchuk/piton',
    abit: 'https://github.com/OlexiyOdarchuk/AbitAssistant_Bot',
    todolist: 'https://github.com/OlexiyOdarchuk/todolist',
    linkshortener: 'https://github.com/OlexiyOdarchuk/linkShortener'
  };

  // Per-project accent styling. Important projects get distinctive border + glow,
  // less-important ones fall back to the neutral glass treatment.
  const accents: Record<(typeof order)[number], { ring: string; glow: string; kicker: string; tagAccent: string } | null> = {
    gomonobanksdk: {
      ring: 'border-cyan-400/30 hover:border-cyan-400/50',
      glow: 'from-cyan-500/15 to-emerald-500/10',
      kicker: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
      tagAccent: 'group-hover:text-cyan-300'
    },
    monokasa: {
      ring: 'border-emerald-400/25 hover:border-emerald-400/50',
      glow: 'from-emerald-500/12 to-cyan-500/8',
      kicker: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
      tagAccent: 'group-hover:text-emerald-300'
    },
    shminer: {
      ring: 'border-amber-400/30 hover:border-amber-400/50',
      glow: 'from-amber-500/15 to-rose-500/10',
      kicker: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
      tagAccent: 'group-hover:text-amber-300'
    },
    abit: {
      ring: 'border-violet-400/30 hover:border-violet-400/50',
      glow: 'from-violet-500/15 to-indigo-500/10',
      kicker: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
      tagAccent: 'group-hover:text-violet-300'
    },
    piton: {
      ring: 'border-violet-400/30 hover:border-violet-400/50',
      glow: 'from-violet-500/15 to-pink-500/10',
      kicker: 'border-violet-400/30 bg-violet-500/10 text-violet-200',
      tagAccent: 'group-hover:text-violet-300'
    },
    todolist: null,
    linkshortener: null
  };
</script>

<section id="projects" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    {#if variant === 'full' && showHeader}
      <Reveal>
        <div class="mb-12">
          <span class="font-mono text-sm text-amber-300">// projects/</span>
          <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.projects.title}</h2>
          <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.projects.subtitle}</p>
        </div>
      </Reveal>
    {:else if variant === 'featured'}
      <Reveal>
        <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="font-mono text-sm text-amber-300">// projects/</span>
            <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.home.teaserProjects.title}</h2>
            <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.home.teaserProjects.subtitle}</p>
          </div>
          <a
            href="/projects"
            class="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
          >
            {$t.home.teaserProjects.cta}
            <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    {/if}

    <!-- Featured: rombik -->
    <Reveal>
      <article
        class="glass-strong border-gradient relative mb-6 overflow-hidden rounded-3xl p-8 sm:p-10"
      >
        <div class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-500/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl"></div>

        <div class="relative grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-200">
              <Sparkles class="h-3.5 w-3.5" />
              {$t.projects.featured.rombik.kicker}
            </div>

            <h3 class="mt-5 text-4xl font-extrabold tracking-tight">
              <span class="text-gradient">{$t.projects.featured.rombik.name}</span>
            </h3>
            <p class="mt-2 text-lg text-white/85">{$t.projects.featured.rombik.tagline}</p>
            <p class="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{$t.projects.featured.rombik.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each $t.projects.featured.rombik.tags as tag}
                <li
                  class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/75"
                >
                  {tag}
                </li>
              {/each}
            </ul>

            <div class="mt-7 flex flex-wrap gap-3">
              <a
                href="/lab#rombik"
                class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-rose-500/30 transition hover:brightness-110"
              >
                {$t.projects.featured.rombik.cta1}
                <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://rombik.ishawyha.dev"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                <ExternalLink class="h-4 w-4" />
                {$t.projects.featured.rombik.cta2}
              </a>
              <a
                href="https://github.com/OlexiyOdarchuk/rombik"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-white/20 hover:text-white"
              >
                <Github class="h-4 w-4" />
                {$t.projects.featured.rombik.cta3}
              </a>
            </div>
          </div>

          <!-- Code preview card: rombik input (Python) -->
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0916]/80 font-mono text-[12px] leading-relaxed shadow-2xl shadow-black/40"
          >
            <div class="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></span>
              <span class="ml-2 text-[11px] text-[var(--color-muted)]">algorithm.py</span>
            </div>
            <TypewriterCode lines={rombikSnippet} />
          </div>
        </div>
      </article>
    </Reveal>

    <!-- Grid of other projects -->
    {#if variant === 'full'}
    <div class="grid gap-5 md:grid-cols-2">
      {#each order as key, i}
        {@const project = $t.projects.list[key]}
        {@const accent = accents[key]}
        <Reveal delay={i * 80}>
          <a
            href={live[key] ?? links[key]}
            target="_blank"
            rel="noopener noreferrer"
            class="glass group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition hover:-translate-y-1 hover:bg-white/[0.06] {accent ? accent.ring : 'border-white/10 hover:border-white/20'} md:[&:last-child:nth-child(odd)]:col-span-2"
          >
            {#if accent}
              <div class="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gradient-to-br {accent.glow} blur-3xl"></div>
            {/if}

            <div class="relative flex items-start justify-between gap-4">
              <div>
                {#if accent && project.kicker}
                  <div class="mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider {accent.kicker}">
                    <Sparkles class="h-3 w-3" />
                    {project.kicker}
                  </div>
                {/if}
                <h3 class="text-xl font-semibold text-white">{project.title}</h3>
                <p class="mt-1 text-sm text-[var(--color-muted)]">{project.subtitle}</p>
              </div>
              <span
                class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[var(--color-muted)] transition group-hover:border-white/20 group-hover:text-white"
              >
                {#if live[key]}
                  <Globe class="h-4 w-4" />
                {:else}
                  <Github class="h-4 w-4" />
                {/if}
              </span>
            </div>

            <p class="relative mt-4 flex-1 text-sm leading-relaxed text-white/75">{project.description}</p>

            <ul class="relative mt-5 flex flex-wrap gap-2">
              {#each project.tags as tag}
                <li
                  class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/80"
                >
                  {tag}
                </li>
              {/each}
            </ul>

            <div class="relative mt-5 flex items-center justify-between gap-3">
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-white/75 transition {accent ? accent.tagAccent : 'group-hover:text-violet-300'}">
                {live[key] ? $t.projects.viewLive : $t.projects.viewSource}
                <ArrowRight class="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
              {#if key === 'shminer'}
                <button
                  type="button"
                  onclick={gotoBench}
                  class="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
                >
                  <Activity class="h-3 w-3" />
                  {$t.projects.liveBench}
                </button>
              {:else if live[key]}
                <button
                  type="button"
                  onclick={(e) => openExternal(e, links[key])}
                  class="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/70 transition hover:border-white/20 hover:text-white"
                  aria-label="GitHub"
                >
                  <Github class="h-3 w-3" />
                  {$t.projects.sourceShort}
                </button>
              {/if}
            </div>
          </a>
        </Reveal>
      {/each}
    </div>
    {/if}
  </div>
</section>
