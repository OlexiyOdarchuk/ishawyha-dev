<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Github, ExternalLink, Sparkles, ArrowRight } from 'lucide-svelte';

  const order = ['shminer', 'todolist', 'linkshortener', 'abit'] as const;

  const links: Record<(typeof order)[number], string> = {
    shminer: 'https://github.com/OlexiyOdarchuk/Student-Hryvnia-Miner',
    todolist: 'https://github.com/OlexiyOdarchuk/todolist',
    linkshortener: 'https://github.com/OlexiyOdarchuk/linkShortener',
    abit: 'https://github.com/OlexiyOdarchuk/AbitAssistant_Bot'
  };
</script>

<section id="projects" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-12">
        <span class="font-mono text-sm text-amber-300">// projects/</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.projects.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.projects.subtitle}</p>
      </div>
    </Reveal>

    <!-- Featured: Piton -->
    <Reveal>
      <article
        class="glass-strong border-gradient relative mb-6 overflow-hidden rounded-3xl p-8 sm:p-10"
      >
        <div class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl"></div>

        <div class="relative grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
              <Sparkles class="h-3.5 w-3.5" />
              {$t.projects.featured.piton.kicker}
            </div>

            <h3 class="mt-5 text-4xl font-extrabold tracking-tight">
              <span class="text-gradient-cool">{$t.projects.featured.piton.name}</span>
            </h3>
            <p class="mt-2 text-lg text-white/85">{$t.projects.featured.piton.tagline}</p>
            <p class="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{$t.projects.featured.piton.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each $t.projects.featured.piton.tags as tag}
                <li
                  class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/75"
                >
                  {tag}
                </li>
              {/each}
            </ul>

            <div class="mt-7 flex flex-wrap gap-3">
              <a
                href="#lab"
                class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
              >
                {$t.projects.featured.piton.cta1}
                <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="https://piton.ishawyha.dev"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                <ExternalLink class="h-4 w-4" />
                {$t.projects.featured.piton.cta2}
              </a>
              <a
                href="https://github.com/OlexiyOdarchuk/piton"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-white/20 hover:text-white"
              >
                <Github class="h-4 w-4" />
                {$t.projects.featured.piton.cta3}
              </a>
            </div>
          </div>

          <!-- Code preview card -->
          <div
            class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0916]/80 font-mono text-[12px] leading-relaxed shadow-2xl shadow-black/40"
          >
            <div class="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></span>
              <span class="ml-2 text-[11px] text-[var(--color-muted)]">main.piton</span>
            </div>
            <pre class="overflow-x-auto p-4 text-white/90"><code><span class="text-pink-300">functia</span> <span class="text-amber-200">main</span>():
    <span class="text-pink-300">drukuvaty</span> <span class="text-emerald-300">"Hello, Piton!"</span>

    числа = [<span class="text-cyan-300">1</span>, <span class="text-cyan-300">2</span>, <span class="text-cyan-300">3</span>, <span class="text-cyan-300">5</span>, <span class="text-cyan-300">8</span>]
    sum = <span class="text-cyan-300">0</span>
    i = <span class="text-cyan-300">0</span>
    <span class="text-pink-300">poky</span> i &lt; <span class="text-violet-300">dovzhyna</span>(числа):
        sum = sum + числа[i]
        i = i + <span class="text-cyan-300">1</span>

    <span class="text-pink-300">drukuvaty</span> <span class="text-emerald-300">"Сума:"</span>
    <span class="text-pink-300">drukuvaty</span> sum

main()</code></pre>
          </div>
        </div>
      </article>
    </Reveal>

    <!-- Grid of other projects -->
    <div class="grid gap-5 md:grid-cols-2">
      {#each order as key, i}
        {@const project = $t.projects.list[key]}
        <Reveal delay={i * 80}>
          <a
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            class="glass group relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition hover:-translate-y-1 hover:bg-white/[0.06]"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-white">{project.title}</h3>
                <p class="mt-1 text-sm text-[var(--color-muted)]">{project.subtitle}</p>
              </div>
              <span
                class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[var(--color-muted)] transition group-hover:border-white/20 group-hover:text-white"
              >
                <Github class="h-4 w-4" />
              </span>
            </div>

            <p class="mt-4 flex-1 text-sm leading-relaxed text-white/75">{project.description}</p>

            <ul class="mt-5 flex flex-wrap gap-2">
              {#each project.tags as tag}
                <li
                  class="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/70"
                >
                  {tag}
                </li>
              {/each}
            </ul>

            <div class="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/60 transition group-hover:text-violet-300">
              {$t.projects.viewSource}
              <ArrowRight class="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </div>
          </a>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
