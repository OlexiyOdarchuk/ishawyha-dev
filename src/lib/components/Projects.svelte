<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import TypewriterCode from './TypewriterCode.svelte';
  import { DEMOS } from '$lib/rombik/demo';
  import { goto } from '$app/navigation';
  import { Github, ExternalLink, ArrowRight, Activity, Globe, Sparkles, BookText } from 'lucide-svelte';

  let { variant = 'full', showHeader = true }: { variant?: 'full' | 'featured'; showHeader?: boolean } =
    $props();

  const ROMBIK_VERSION = '1.0.0';

  function gotoBench(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    goto('/lab#bench');
  }

  const live: Record<string, string> = {
    piton: 'https://piton.ishawyha.dev'
  };

  function openExternal(e: MouseEvent, url: string) {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Featured rombik card shows a real prebuilt flowchart (no code).
  const rombikDemo = DEMOS[0];

  // Featured Piton card types out a Piton snippet (Ukrainian-syntax language).
  const pitonSnippet = [
    [{ text: 'functia ', cls: 'tok-kw' }, { text: 'main():' }],
    [{ text: '    drukuvaty ', cls: 'tok-kw' }, { text: '"Привіт, світе!"', cls: 'tok-string' }],
    [{ text: '    i = ' }, { text: '0', cls: 'tok-num' }],
    [{ text: '    poky', cls: 'tok-kw' }, { text: ' i < ' }, { text: '6', cls: 'tok-num' }, { text: ':' }],
    [{ text: '        drukuvaty', cls: 'tok-kw' }, { text: ' i' }],
    [{ text: '        i = i + ' }, { text: '1', cls: 'tok-num' }],
    [],
    [{ text: 'main()' }],
    [{ text: '# тюрінг-повна · WASM через TinyGo', cls: 'tok-comment' }]
  ];

  // Notable projects get a colored kicker badge; the rest are plain white cards.
  const order = ['gomonobanksdk', 'monokasa', 'shminer', 'abit', 'todolist', 'linkshortener'] as const;

  const badgeColor: Record<string, string> = {
    gomonobanksdk: 'bg-[var(--color-sky-bg)] text-[var(--color-sky)]',
    monokasa: 'bg-[var(--color-emerald-bg)] text-[var(--color-emerald)]',
    shminer: 'bg-[var(--color-gold-bg)] text-[var(--color-gold)]',
    abit: 'bg-[var(--color-indigo-bg)] text-[var(--color-accent-500)]'
  };

  const links: Record<(typeof order)[number] | 'piton', string> = {
    gomonobanksdk: 'https://github.com/OlexiyOdarchuk/go-monobank-sdk',
    monokasa: 'https://github.com/OlexiyOdarchuk/monokasa',
    shminer: 'https://github.com/OlexiyOdarchuk/Student-Hryvnia-Miner',
    piton: 'https://github.com/OlexiyOdarchuk/piton',
    abit: 'https://github.com/OlexiyOdarchuk/AbitAssistant_Bot',
    todolist: 'https://github.com/OlexiyOdarchuk/todolist',
    linkshortener: 'https://github.com/OlexiyOdarchuk/linkShortener'
  };
</script>

<section id="projects" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    {#if variant === 'full' && showHeader}
      <Reveal>
        <div class="mb-8">
          <span class="kicker">// projects</span>
          <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.projects.title}</h2>
          <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.projects.subtitle}</p>
        </div>
      </Reveal>
    {:else if variant === 'featured'}
      <Reveal>
        <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span class="kicker">// projects</span>
            <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.home.teaserProjects.title}</h2>
            <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.home.teaserProjects.subtitle}</p>
          </div>
          <a href="/projects" class="btn-secondary group">
            {$t.home.teaserProjects.cta}
            <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    {/if}

    <!-- FLAGSHIP: rombik — rose-tinted card + badge -->
    <Reveal>
      <article
        class="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style="background: var(--color-rose-bg); border-color: var(--color-rose-line);"
      >
        <div class="grid gap-7 md:grid-cols-[1.25fr_1fr] md:gap-10">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style="background: var(--color-rose);">
                <Sparkles class="h-3 w-3" />
                {$t.projects.featured.rombik.kicker}
              </span>
              <span class="tag">v{ROMBIK_VERSION}</span>
            </div>

            <h3 class="display mt-4 text-4xl sm:text-5xl" style="color: var(--color-rose);">{$t.projects.featured.rombik.name}</h3>
            <p class="mt-2 text-lg font-semibold text-[var(--color-fg)]">{$t.projects.featured.rombik.tagline}</p>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-body)]">{$t.projects.featured.rombik.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each $t.projects.featured.rombik.tags as tag}
                <li class="tag">{tag}</li>
              {/each}
            </ul>

            <div class="mt-6 flex flex-wrap gap-3">
              <a href="/rombik" class="btn-primary group" style="background: var(--color-rose); box-shadow: 0 8px 20px -8px rgba(190,18,60,0.5);">
                {$t.projects.featured.rombik.cta1}
                <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href="https://rombik.ishawyha.dev" target="_blank" rel="noopener noreferrer" class="btn-secondary">
                <ExternalLink class="h-4 w-4" />
                {$t.projects.featured.rombik.cta2}
              </a>
              <a href="https://rombik.ishawyha.dev/api/v1/openapi.json" target="_blank" rel="noopener noreferrer" class="btn-ghost">
                <BookText class="h-4 w-4" />
                {$t.projects.featured.rombik.cta3}
              </a>
            </div>
          </div>

          <!-- Real prebuilt flowchart, builds top→bottom on view -->
          <div class="self-center overflow-hidden rounded-xl border bg-white p-3 shadow-lg" style="border-color: var(--color-rose-line);">
            <div class="pf-sheet">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html rombikDemo.svg}
            </div>
          </div>
        </div>
      </article>
    </Reveal>

    {#if variant === 'full'}
    <!-- FLAGSHIP 2: Piton — sky-tinted card, with typed code -->
    <Reveal>
      <article
        class="mt-5 overflow-hidden rounded-2xl border p-6 sm:p-8"
        style="background: color-mix(in srgb, var(--color-sky) 8%, var(--color-card)); border-color: color-mix(in srgb, var(--color-sky) 35%, var(--color-line));"
      >
        <div class="grid gap-7 md:grid-cols-[1.25fr_1fr] md:gap-10">
          <div>
            <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style="background: var(--color-sky);">
              <Sparkles class="h-3 w-3" />
              {$t.projects.featured.piton.kicker}
            </span>
            <h3 class="display mt-4 text-4xl sm:text-5xl" style="color: var(--color-sky);">{$t.projects.featured.piton.name}</h3>
            <p class="mt-2 text-lg font-semibold text-[var(--color-fg)]">{$t.projects.featured.piton.tagline}</p>
            <p class="mt-3 max-w-xl text-sm leading-relaxed text-[var(--color-body)]">{$t.projects.featured.piton.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each $t.projects.featured.piton.tags as tag}
                <li class="tag">{tag}</li>
              {/each}
            </ul>

            <div class="mt-6 flex flex-wrap gap-3">
              <a href="/lab#lab" class="btn-primary group" style="background: var(--color-sky); box-shadow: 0 8px 20px -8px color-mix(in srgb, var(--color-sky) 60%, transparent);">
                {$t.projects.featured.piton.cta1}
                <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href={live.piton} target="_blank" rel="noopener noreferrer" class="btn-secondary">
                <BookText class="h-4 w-4" />
                {$t.projects.featured.piton.cta2}
              </a>
              <a href="https://github.com/OlexiyOdarchuk/piton" target="_blank" rel="noopener noreferrer" class="btn-ghost">
                <Github class="h-4 w-4" />
                {$t.projects.featured.piton.cta3}
              </a>
            </div>
          </div>

          <!-- Typed Piton code specimen (theme-aware) -->
          <div class="self-center overflow-hidden rounded-xl border border-[var(--color-ink-line)] bg-[var(--color-ink)] font-mono text-[12px] leading-relaxed shadow-lg">
            <div class="flex items-center gap-2 border-b border-[var(--color-ink-line)] px-4 py-2.5">
              <span class="h-2 w-2 rounded-full" style="background: var(--color-sky);"></span>
              <span class="ml-1 text-[11px] text-[var(--color-ink-muted)]">main.piton</span>
            </div>
            <TypewriterCode lines={pitonSnippet} />
          </div>
        </div>
      </article>
    </Reveal>

    <!-- Other projects: plain white cards -->
    <div class="mt-5 grid gap-4 sm:grid-cols-2">
      {#each order as key, i}
        {@const project = $t.projects.list[key]}
        <Reveal delay={(i % 2) * 60}>
          <a
            href={live[key] ?? links[key]}
            target="_blank"
            rel="noopener noreferrer"
            class="card card-hover group flex h-full flex-col p-6 md:[&:last-child:nth-child(odd)]:col-span-2"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                {#if project.kicker}
                  <span class="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase {badgeColor[key] ?? 'bg-[var(--color-bg-soft)] text-[var(--color-muted)]'}">{project.kicker}</span>
                {/if}
                <h3 class="mt-2 text-lg font-bold text-[var(--color-fg)] group-hover:text-[var(--color-accent-500)]">{project.title}</h3>
                <p class="mt-0.5 text-sm text-[var(--color-muted)]">{project.subtitle}</p>
              </div>
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] transition group-hover:border-[var(--color-accent-400)] group-hover:text-[var(--color-accent-500)]">
                {#if live[key]}<Globe class="h-4 w-4" />{:else}<Github class="h-4 w-4" />{/if}
              </span>
            </div>

            <p class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-body)]">{project.description}</p>

            <ul class="mt-4 flex flex-wrap gap-1.5">
              {#each project.tags as tag}
                <li class="tag">{tag}</li>
              {/each}
            </ul>

            <div class="mt-4 flex items-center justify-between gap-3">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-500)]">
                {live[key] ? $t.projects.viewLive : $t.projects.viewSource}
                <ArrowRight class="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
              {#if key === 'shminer'}
                <button type="button" onclick={gotoBench} class="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-400)]/40 bg-[var(--color-accent-400)]/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider text-[var(--color-accent-500)] uppercase transition hover:bg-[var(--color-accent-400)]/20">
                  <Activity class="h-3 w-3" />
                  {$t.projects.liveBench}
                </button>
              {:else if live[key]}
                <button type="button" onclick={(e) => openExternal(e, links[key])} class="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1 font-mono text-[11px] tracking-wider text-[var(--color-muted)] uppercase transition hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-500)]" aria-label="GitHub">
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

<style>
  /* Featured rombik flowchart: «будується» зверху вниз при появі. */
  .pf-sheet :global(svg) {
    display: block;
    width: 100%;
    height: auto;
    max-height: 360px;
  }
  .pf-sheet {
    animation: pf-build 1.2s cubic-bezier(0.45, 0, 0.2, 1) 0.2s backwards;
  }
  @keyframes pf-build {
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .pf-sheet { animation-duration: 0.01s; }
  }
</style>
