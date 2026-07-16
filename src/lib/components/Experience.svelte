<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Briefcase } from 'lucide-svelte';
</script>

<section id="experience" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-8">
        <span class="kicker">// experience</span>
        <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.experience.title}</h2>
      </div>
    </Reveal>

    <div class="grid gap-4">
      {#each Object.entries($t.experience.items) as [key, item], i}
        <Reveal delay={i * 80}>
          <article
            class="card p-6 sm:p-7 relative overflow-hidden"
            style="background: linear-gradient(180deg, var(--color-indigo-bg) 0%, var(--color-card) 42%);"
          >
            <div class="flex items-start gap-4">
              <span
                class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--color-accent-400)]/12 text-[var(--color-accent-500)] ring-1 ring-[var(--color-accent-400)]/20"
              >
                <Briefcase class="h-5 w-5" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 class="text-lg font-bold text-[var(--color-fg)]">
                    {item.role} <span class="text-[var(--color-accent-500)]">· {item.place}</span>
                  </h3>
                  <span class="font-mono text-xs whitespace-nowrap text-[var(--color-muted)]">{item.date}</span>
                </div>
                {#if 'note' in item && item.note}
                  <p class="mt-0.5 font-mono text-[11px] text-[var(--color-muted)]">{item.note}</p>
                {/if}
              </div>
            </div>

            {#if 'bullets' in item && item.bullets}
              <ul class="mt-4 space-y-2 pl-1">
                {#each item.bullets as b}
                  <li class="flex gap-2.5 text-sm leading-relaxed text-[var(--color-body)]">
                    <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-400)]"></span>
                    <span>{b}</span>
                  </li>
                {/each}
              </ul>
            {/if}

            {#if 'tags' in item && item.tags}
              <div class="mt-4 flex flex-wrap gap-1.5">
                {#each item.tags as tag}
                  <span
                    class="rounded-full bg-[var(--color-tag-bg)] px-2.5 py-0.5 font-mono text-[11px] font-medium text-[var(--color-accent-500)]"
                  >{tag}</span>
                {/each}
              </div>
            {/if}
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
