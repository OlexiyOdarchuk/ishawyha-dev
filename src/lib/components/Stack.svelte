<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';

  type CategoryKey = 'languages' | 'backend' | 'db' | 'frontend' | 'ai' | 'devops';

  const stack: Record<CategoryKey, string[]> = {
    languages: ['Go', 'Python', 'TypeScript', 'C', 'Bash'],
    backend: ['Gin', 'Fiber', 'REST API', 'WebSockets', 'SSE', 'Goroutines', 'JWT', 'OAuth 2.0', 'monobank API', 'LiqPay'],
    db: ['PostgreSQL', 'pgvector', 'Redis', 'ClickHouse', 'SQLite', 'MongoDB'],
    frontend: ['Svelte 5', 'Wails', 'Tailwind CSS', 'Vite'],
    ai: ['Anthropic Claude', 'OpenAI', 'MCP', 'RAG', 'Ollama', 'fal.ai'],
    devops: ['Docker', 'Kubernetes', 'Linux (Arch / NixOS)', 'Git', 'GitHub Actions', 'TinyGo', 'Typst', 'Cloudflare']
  };

  const order: CategoryKey[] = ['languages', 'backend', 'db', 'frontend', 'ai', 'devops'];
</script>

<section id="stack" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-8">
        <span class="kicker">// stack</span>
        <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.stack.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.stack.subtitle}</p>
      </div>
    </Reveal>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each order as cat, i}
        <Reveal delay={i * 60}>
          <div class="card h-full p-5">
            <h3 class="mb-3 font-mono text-xs font-semibold tracking-[0.12em] text-[var(--color-accent-500)] uppercase">{$t.stack.categories[cat]}</h3>
            <ul class="flex flex-wrap gap-1.5">
              {#each stack[cat] as tool}
                <li class="tag">{tool}</li>
              {/each}
            </ul>
          </div>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
