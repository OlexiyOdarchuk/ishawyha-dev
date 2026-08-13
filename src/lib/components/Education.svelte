<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { GraduationCap } from 'lucide-svelte';

  type CourseItem = { courseStart: number; courseYears: number; courseTpl: string };

  const hasCourse = (item: unknown): item is CourseItem =>
    typeof item === 'object' && item !== null && 'courseStart' in item;

  // Номер курсу рахуємо від року вступу, а не зашиваємо в текст. Межа року —
  // серпень (зарахування / початок нового курсу). Після випуску значка немає.
  function courseNo({ courseStart, courseYears }: CourseItem): number | null {
    const now = new Date();
    const n = now.getFullYear() - courseStart + (now.getMonth() >= 7 ? 1 : 0);
    return n >= 1 && n <= courseYears ? n : null;
  }

  const ordinal = (n: number) => ['th', 'st', 'nd', 'rd'][n > 3 ? 0 : n] ?? 'th';

  const courseLabel = (item: CourseItem) => {
    const n = courseNo(item);
    return n === null ? null : item.courseTpl.replace('{n}', String(n)).replace('{ord}', ordinal(n));
  };
</script>

<section id="education" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-8">
        <span class="kicker">// education</span>
        <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.education.title}</h2>
      </div>
    </Reveal>

    <div class="grid gap-4 md:grid-cols-2">
      {#each Object.entries($t.education.items) as [key, item], i}
        {@const badge = hasCourse(item) ? courseLabel(item) : 'note' in item ? item.note : null}
        <Reveal delay={i * 80}>
          <article class="card flex h-full items-start gap-4 p-6">
            <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-500)]">
              <GraduationCap class="h-5 w-5" />
            </span>
            <div class="flex-1">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-bold text-[var(--color-fg)]">{item.title}</h3>
                <span class="font-mono text-xs whitespace-nowrap text-[var(--color-muted)]">{item.date}</span>
              </div>
              <p class="text-sm text-[var(--color-muted)]">{item.place}</p>
              {#if badge}
                <span class="mt-2 inline-block rounded-full bg-[var(--color-accent-400)]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--color-accent-500)]">{badge}</span>
              {/if}
            </div>
          </article>
        </Reveal>
      {/each}
    </div>
  </div>
</section>
