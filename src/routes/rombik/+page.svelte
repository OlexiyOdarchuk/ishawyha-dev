<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import Reveal from '$lib/components/Reveal.svelte';
  import RombikLab from '$lib/components/RombikLab.svelte';
  import {
    ArrowRight, ExternalLink, Code2, Terminal, Bot, BookText, Check,
    Workflow, Languages, FileDown, Layers, Route, SlidersHorizontal,
    CreditCard, BarChart3, ShieldCheck, Globe, Cpu, Boxes
  } from 'lucide-svelte';

  const APP = 'https://rombik.ishawyha.dev';
  const API = 'https://rombik.ishawyha.dev/api/v1/openapi.json';

  const p = $derived($t.rombikPage);

  const featureIcons = [ShieldCheck, Languages, FileDown, Layers, Workflow, SlidersHorizontal];
  const stackIcons = [CreditCard, Cpu];
  const commIcons = [CreditCard, BarChart3, ShieldCheck, Globe];
  const aiIcons = [Code2, Terminal, Workflow, Bot];

  function track(ev: string) {
    if (typeof window !== 'undefined') window.gtag?.('event', ev);
  }
</script>

<Seo title={p.metaTitle} description={p.metaDesc} path="/rombik" />

<!-- HERO -->
<section class="relative px-6 pt-32 pb-12 sm:pt-36">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <article
        class="relative overflow-hidden rounded-2xl border p-6 sm:p-10"
        style="background: var(--color-rose-bg); border-color: var(--color-rose-line);"
      >
        <span class="kicker" style="color: var(--color-rose);">{p.kicker}</span>
        <h1 class="display mt-3 text-6xl sm:text-7xl" style="color: var(--color-rose);">{p.title}</h1>
        <p class="mt-4 max-w-2xl text-xl font-semibold text-[var(--color-fg)]">{p.tagline}</p>
        <p class="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-body)]">{p.intro}</p>

        <div class="mt-7 flex flex-wrap gap-3">
          <a
            href={APP} target="_blank" rel="noopener noreferrer"
            onclick={() => track('click_rombikpage_open_app')}
            class="btn-primary group" style="background: var(--color-rose); box-shadow: 0 8px 20px -8px rgba(190,18,60,0.5);"
          >
            <ExternalLink class="h-4 w-4" />
            {p.ctaApp}
          </a>
          <a href={API} target="_blank" rel="noopener noreferrer" class="btn-secondary">
            <BookText class="h-4 w-4" />
            {p.ctaApi}
          </a>
          <a href="#demo" class="btn-ghost">{p.ctaDemo}</a>
        </div>

        <ul class="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {#each p.stats as s}
            <li class="rounded-xl border bg-[var(--color-card)]/60 p-4" style="border-color: var(--color-rose-line);">
              <div class="display text-3xl sm:text-4xl" style="color: var(--color-rose);">{s.value}</div>
              <div class="mt-1 text-xs leading-snug text-[var(--color-muted)]">{s.label}</div>
            </li>
          {/each}
        </ul>
      </article>
    </Reveal>
  </div>
</section>

<!-- PIPELINE: how the engine works -->
<section class="relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.pipeline.kicker}</span>
      <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{p.pipeline.title}</h2>
      <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{p.pipeline.subtitle}</p>
    </Reveal>

    <Reveal>
      <ol class="mt-8 grid gap-3 md:grid-cols-5">
        {#each p.pipeline.stages as stage, i}
          <li class="card relative flex flex-col gap-2 p-5">
            <div class="flex items-center gap-2">
              <span class="grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white" style="background: var(--color-rose);">{i + 1}</span>
              <span class="font-mono text-sm font-bold text-[var(--color-fg)]">{stage.name}</span>
            </div>
            <p class="text-xs leading-snug text-[var(--color-muted)]">{stage.desc}</p>
          </li>
        {/each}
      </ol>
    </Reveal>

    <Reveal>
      <div class="card mt-5 p-6" style="background: var(--color-rose-bg); border-color: var(--color-rose-line);">
        <h3 class="text-sm font-bold text-[var(--color-fg)]">{p.pipeline.problemsTitle}</h3>
        <ul class="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {#each p.pipeline.problems as item}
            <li class="flex gap-2.5 text-sm text-[var(--color-body)]">
              <Check class="mt-0.5 h-4 w-4 flex-none" style="color: var(--color-rose);" />
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    </Reveal>
  </div>
</section>

<!-- FEATURES -->
<section class="relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.features.kicker}</span>
      <h2 class="display mt-3 max-w-3xl text-4xl text-[var(--color-fg)] sm:text-5xl">{p.features.title}</h2>
    </Reveal>
    <Reveal>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each p.features.items as f, i}
          {@const Icon = featureIcons[i] ?? Boxes}
          <li class="card flex flex-col gap-2 p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg" style="background: var(--color-rose-bg); color: var(--color-rose);"><Icon class="h-4 w-4" /></span>
            <div class="mt-1 text-sm font-bold text-[var(--color-fg)]">{f.title}</div>
            <div class="text-xs leading-relaxed text-[var(--color-muted)]">{f.desc}</div>
          </li>
        {/each}
      </ul>
    </Reveal>
  </div>
</section>

<!-- STACK: built on my own work -->
<section class="relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.stack.kicker}</span>
      <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{p.stack.title}</h2>
      <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{p.stack.subtitle}</p>
    </Reveal>
    <Reveal>
      <ul class="mt-8 grid gap-4 md:grid-cols-2">
        {#each p.stack.items as s, i}
          {@const Icon = stackIcons[i] ?? Boxes}
          <li class="card flex flex-col gap-3 p-6">
            <span class="grid h-10 w-10 place-items-center rounded-lg" style="background: var(--color-rose-bg); color: var(--color-rose);"><Icon class="h-5 w-5" /></span>
            <div class="text-base font-bold text-[var(--color-fg)]">{s.title}</div>
            <div class="text-sm leading-relaxed text-[var(--color-muted)]">{s.desc}</div>
            <a href={s.link} class="mt-1 inline-flex w-fit items-center gap-1 text-sm font-semibold" style="color: var(--color-rose);">{s.linkLabel}</a>
          </li>
        {/each}
      </ul>
    </Reveal>
  </div>
</section>

<!-- COMMERCIAL -->
<section class="relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.commercial.kicker}</span>
      <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{p.commercial.title}</h2>
      <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{p.commercial.subtitle}</p>
    </Reveal>
    <Reveal>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each p.commercial.items as c, i}
          {@const Icon = commIcons[i] ?? Boxes}
          <li class="card flex flex-col gap-2 p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg" style="background: var(--color-rose-bg); color: var(--color-rose);"><Icon class="h-4 w-4" /></span>
            <div class="mt-1 text-sm font-bold text-[var(--color-fg)]">{c.title}</div>
            <div class="text-xs leading-relaxed text-[var(--color-muted)]">{c.desc}</div>
          </li>
        {/each}
      </ul>
    </Reveal>
  </div>
</section>

<!-- AI-NATIVE -->
<section class="relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.ai.kicker}</span>
      <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{p.ai.title}</h2>
      <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{p.ai.subtitle}</p>
    </Reveal>
    <div class="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Reveal>
        <ul class="grid gap-4 sm:grid-cols-2">
          {#each p.ai.items as a, i}
            {@const Icon = aiIcons[i] ?? Boxes}
            <li class="card flex flex-col gap-2 p-5">
              <span class="grid h-9 w-9 place-items-center rounded-lg" style="background: var(--color-rose-bg); color: var(--color-rose);"><Icon class="h-4 w-4" /></span>
              <div class="mt-1 text-sm font-bold text-[var(--color-fg)]">{a.title}</div>
              <div class="text-xs leading-relaxed text-[var(--color-muted)]">{a.desc}</div>
            </li>
          {/each}
        </ul>
      </Reveal>
      <Reveal>
        <div class="card flex h-full flex-col overflow-hidden p-0">
          <div class="border-b border-[var(--color-ink-line)] bg-[var(--color-ink-soft)] px-4 py-2.5 font-mono text-[11px] text-[var(--color-ink-muted)]">{p.ai.mcpTitle}</div>
          <pre class="m-0 flex-1 overflow-x-auto bg-[var(--color-ink)] p-5 font-mono text-[12px] leading-[1.7] text-[var(--color-ink-fg)]">{p.ai.mcpSnippet}</pre>
        </div>
      </Reveal>
    </div>
  </div>
</section>

<!-- DEMO -->
<section id="demo" class="scroll-mt-nav relative px-6 py-14">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <span class="kicker">// {p.demo.kicker}</span>
      <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{p.demo.title}</h2>
      <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{p.demo.subtitle}</p>
    </Reveal>
  </div>
  <RombikLab showHeader={false} />
</section>

<!-- FINAL CTA -->
<section class="relative px-6 pb-24 pt-4">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="overflow-hidden rounded-2xl border p-8 text-center sm:p-12" style="background: var(--color-rose-bg); border-color: var(--color-rose-line);">
        <h2 class="display text-3xl text-[var(--color-fg)] sm:text-4xl">{p.finalCta.title}</h2>
        <p class="mx-auto mt-3 max-w-xl text-base text-[var(--color-muted)]">{p.finalCta.subtitle}</p>
        <a
          href={APP} target="_blank" rel="noopener noreferrer"
          onclick={() => track('click_rombikpage_final_cta')}
          class="btn-primary group mx-auto mt-6 w-fit" style="background: var(--color-rose); box-shadow: 0 8px 20px -8px rgba(190,18,60,0.5);"
        >
          <ExternalLink class="h-4 w-4" />
          {p.finalCta.button}
        </a>
      </div>
    </Reveal>
  </div>
</section>
