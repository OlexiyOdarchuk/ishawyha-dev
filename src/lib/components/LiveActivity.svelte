<script lang="ts">
  // Live "recent commits" pulled from GitHub's public events feed.
  // No backend: the API endpoint is CORS-enabled, and we cache for 10
  // minutes in localStorage so refreshes don't hammer the rate limit.
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { GitCommit, ExternalLink } from 'lucide-svelte';

  type Commit = {
    repo: string;
    sha: string;
    message: string;
    url: string;
    when: number; // epoch ms
  };

  const USER = 'OlexiyOdarchuk';
  const CACHE_KEY = 'ishawyha:gh-events';
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const MAX_ITEMS = 3;

  let commits = $state<Commit[]>([]);
  let loaded = $state(false);
  let failed = $state(false);

  function relativeTime(ms: number): string {
    const diff = Date.now() - ms;
    const min = 60 * 1000;
    const hr = 60 * min;
    const day = 24 * hr;
    if (diff < min) return 'now';
    if (diff < hr) return `${Math.round(diff / min)}m`;
    if (diff < day) return `${Math.round(diff / hr)}h`;
    return `${Math.round(diff / day)}d`;
  }

  function readCache(): Commit[] | null {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { at, data } = JSON.parse(raw);
      if (Date.now() - at > CACHE_TTL_MS) return null;
      return data as Commit[];
    } catch {
      return null;
    }
  }
  function writeCache(data: Commit[]) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch {}
  }

  async function fetchLatestCommits(): Promise<Commit[]> {
    // The /users/:user/events/public endpoint stopped returning the
    // PushEvent.payload.commits[] array — so we'd see the timestamps but
    // not the messages. Detour: fetch the most-recently-pushed repos,
    // then ask each one for its single latest commit. Costs ≈4 API
    // requests; cached for 10 min so it's well below the unauthenticated
    // rate limit (60/h/IP).
    const headers = { Accept: 'application/vnd.github+json' };
    const reposRes = await fetch(
      `https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6&type=owner`,
      { headers }
    );
    if (!reposRes.ok) throw new Error(`gh repos ${reposRes.status}`);
    const repos: Array<{ name: string; fork: boolean }> = await reposRes.json();

    const candidates = repos.filter((r) => !r.fork).slice(0, MAX_ITEMS);
    const commits = await Promise.all(
      candidates.map(async (r) => {
        const cr = await fetch(
          `https://api.github.com/repos/${USER}/${r.name}/commits?per_page=1`,
          { headers }
        );
        if (!cr.ok) return null;
        const cs = await cr.json();
        const c = cs[0];
        if (!c) return null;
        return {
          repo: r.name,
          sha: c.sha.slice(0, 7),
          message: (c.commit?.message ?? '').split('\n')[0].slice(0, 70),
          url: c.html_url,
          when: new Date(c.commit?.committer?.date ?? c.commit?.author?.date).getTime()
        } as Commit;
      })
    );
    return commits
      .filter((c): c is Commit => c !== null && Number.isFinite(c.when))
      .sort((a, b) => b.when - a.when);
  }

  onMount(async () => {
    const cached = readCache();
    if (cached && cached.length) {
      commits = cached;
      loaded = true;
      return;
    }
    try {
      const fresh = await fetchLatestCommits();
      if (fresh.length) {
        commits = fresh;
        writeCache(fresh);
      }
    } catch {
      failed = true;
    } finally {
      loaded = true;
    }
  });
</script>

{#if loaded && commits.length > 0 && !failed}
  <aside class="mx-auto mt-12 max-w-6xl px-6" aria-label="Recent commits">
    <div class="flex items-baseline justify-between gap-3 border-b border-[var(--color-line)] pb-2">
      <div class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-accent-500)] font-semibold">
        <GitCommit class="h-3.5 w-3.5" />
        {$t.activity.title}
      </div>
      <a
        href="https://github.com/{USER}?tab=overview"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      >
        @{USER}
        <ExternalLink class="h-3 w-3" />
      </a>
    </div>
    <ul class="mt-3 grid gap-1.5 sm:grid-cols-2 md:grid-cols-3">
      {#each commits as c}
        <li>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            class="card card-hover group block p-3"
          >
            <div class="flex items-baseline justify-between gap-2 font-mono text-[10px] uppercase tracking-wider">
              <span class="font-semibold text-[var(--color-accent-500)]">{c.repo}</span>
              <span class="text-[var(--color-muted)]">{c.sha} · {relativeTime(c.when)}</span>
            </div>
            <div class="mt-1 truncate text-sm text-[var(--color-fg)]">{c.message}</div>
          </a>
        </li>
      {/each}
    </ul>
  </aside>
{/if}
