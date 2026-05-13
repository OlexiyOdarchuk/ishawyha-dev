<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';

  type CategoryKey = 'languages' | 'backend' | 'db' | 'frontend' | 'ai' | 'devops';

  const stack: Record<CategoryKey, string[]> = {
    languages: ['Go', 'Python', 'C', 'Bash'],
    backend: ['Gin', 'Fiber', 'REST API', 'WebSockets', 'Goroutines', 'JWT', 'OAuth 2.0'],
    db: ['PostgreSQL', 'Redis', 'ClickHouse', 'SQLite', 'MongoDB'],
    frontend: ['Svelte 5', 'Wails', 'Tailwind CSS', 'Vite'],
    ai: ['GPT-4o', 'fal.ai', 'OpenAI SDK', 'Google AI Studio', 'monobank API', 'go-monobank-sdk'],
    devops: ['Docker', 'Linux (Arch / NixOS)', 'Git', 'GitHub Actions', 'TinyGo', 'Bruno', 'Typst', 'mdBook', 'Cloudflare']
  };

  const accents: Record<CategoryKey, string> = {
    languages: 'from-violet-400 to-fuchsia-400',
    backend: 'from-cyan-300 to-violet-400',
    db: 'from-emerald-300 to-cyan-400',
    frontend: 'from-pink-400 to-amber-300',
    ai: 'from-amber-300 to-pink-400',
    devops: 'from-violet-400 to-cyan-300'
  };

  const order: CategoryKey[] = ['languages', 'backend', 'db', 'frontend', 'ai', 'devops'];
</script>

<section id="stack" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-12">
        <span class="font-mono text-sm text-violet-300">// stack.toml</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.stack.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.stack.subtitle}</p>
      </div>
    </Reveal>

    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each order as cat, i}
        <Reveal delay={i * 60}>
          <div class="glass relative h-full overflow-hidden rounded-3xl p-6">
            <div class="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r {accents[cat]}"></div>
            <h3 class="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
              {$t.stack.categories[cat]}
            </h3>
            <ul class="flex flex-wrap gap-2">
              {#each stack[cat] as tool}
                <li
                  class="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[12px] text-white/85 transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  {tool}
                </li>
              {/each}
            </ul>
          </div>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
