<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, lang, setLang } from '$lib/i18n';
  import { Search, ArrowRight } from 'lucide-svelte';

  type Cmd = {
    id: string;
    title: string;
    hint?: string;
    keywords?: string;
    run: () => void;
  };

  let open = $state(false);
  let query = $state('');
  let activeIdx = $state(0);
  let inputEl: HTMLInputElement | null = $state(null);
  let listEl: HTMLUListElement | null = $state(null);

  function nav(path: string) {
    goto(path);
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); } catch {}
  }

  function downloadCv(which: 'ua' | 'en') {
    const a = document.createElement('a');
    a.href = `/CV_Odarchuk_${which.toUpperCase()}.pdf`;
    a.download = `CV_Odarchuk_${which.toUpperCase()}.pdf`;
    a.click();
  }

  // Commands are derived so labels translate with $t.
  const commands = $derived<Cmd[]>([
    { id: 'goto-home',         title: $t.palette.gotoHome,         keywords: 'home main головна',  run: () => nav('/') },
    { id: 'goto-about',        title: $t.palette.gotoAbout,        keywords: 'about me',          run: () => nav('/about') },
    { id: 'goto-achievements', title: $t.palette.gotoAchievements, keywords: 'wins hackathon',    run: () => nav('/about#achievements') },
    { id: 'goto-projects',     title: $t.palette.gotoProjects,     keywords: 'piton shminer',     run: () => nav('/projects') },
    { id: 'goto-services',     title: $t.palette.gotoServices,     keywords: 'hire freelance order замовити послуги', run: () => nav('/services') },
    { id: 'goto-lab',          title: $t.palette.gotoLab,          keywords: 'piton playground',  run: () => nav('/lab') },
    { id: 'goto-bench',        title: $t.palette.gotoBench,        keywords: 'sha256 hashrate',   run: () => nav('/lab#bench') },
    { id: 'goto-rombik',       title: $t.palette.gotoRombik,       keywords: 'rombik flowchart блок-схема dstu python', run: () => nav('/lab#rombik') },
    { id: 'goto-contact',      title: $t.palette.gotoContact,      keywords: 'email telegram',    run: () => nav('/#contact') },
    { id: 'copy-email',        title: $t.palette.copyEmail,        hint: 'me@ishawyha.dev',       run: () => copy('me@ishawyha.dev') },
    { id: 'open-telegram',     title: $t.palette.openTelegram,     hint: '@NeShawyha',            run: () => window.open('https://t.me/NeShawyha', '_blank') },
    { id: 'open-github',       title: $t.palette.openGithub,       hint: 'OlexiyOdarchuk',        run: () => window.open('https://github.com/OlexiyOdarchuk', '_blank') },
    { id: 'cv-ua',             title: $t.palette.downloadCvUa,     hint: 'PDF',                   run: () => downloadCv('ua') },
    { id: 'cv-en',             title: $t.palette.downloadCvEn,     hint: 'PDF',                   run: () => downloadCv('en') },
    { id: 'lang-toggle',       title: $t.palette.toggleLang,       hint: $lang === 'ua' ? 'UA → EN' : 'EN → UA', run: () => setLang($lang === 'ua' ? 'en' : 'ua') }
  ]);

  const filtered = $derived(
    query.trim() === ''
      ? commands
      : commands.filter((c) => {
          const q = query.toLowerCase();
          return c.title.toLowerCase().includes(q) || (c.keywords ?? '').toLowerCase().includes(q);
        })
  );

  async function show() {
    open = true;
    activeIdx = 0;
    await tick();
    inputEl?.focus();
  }

  function hide() {
    open = false;
    query = '';
    activeIdx = 0;
  }

  function run(c: Cmd) {
    hide();
    queueMicrotask(c.run);
  }

  function onKey(e: KeyboardEvent) {
    // Open: Cmd+K / Ctrl+K, but also "/" works like in many search-y UIs.
    if (!open) {
      const slashFromBody =
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement);
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || slashFromBody) {
        e.preventDefault();
        show();
      }
      return;
    }
    // Open palette navigation:
    if (e.key === 'Escape') { e.preventDefault(); hide(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(filtered.length - 1, activeIdx + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(0, activeIdx - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[activeIdx];
      if (c) run(c);
    }
  }

  // Reset activeIdx when filter shrinks.
  $effect(() => {
    if (activeIdx >= filtered.length) activeIdx = 0;
  });

  onMount(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
</script>

{#if open}
  <div class="fixed inset-0 z-[80] flex items-start justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label="Command palette">
    <button
      type="button"
      class="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      aria-label="Close"
      onclick={hide}
    ></button>

    <div class="relative mt-[8vh] w-full max-w-xl overflow-hidden border border-[var(--color-ink-line)] bg-[var(--color-ink)] text-[var(--color-ink-fg)] shadow-2xl shadow-black/50">
      <div class="flex items-center gap-2 border-b border-[var(--color-ink-line)] px-4 py-3">
        <Search class="h-4 w-4 text-[var(--color-ink-muted)]" />
        <input
          bind:this={inputEl}
          bind:value={query}
          type="text"
          placeholder={$t.palette.placeholder}
          aria-label={$t.palette.placeholder}
          class="flex-1 bg-transparent text-sm text-[var(--color-ink-fg)] placeholder:text-[var(--color-ink-muted)] focus:outline-none"
        />
        <kbd class="border border-[var(--color-ink-line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-muted)]">ESC</kbd>
      </div>

      <ul bind:this={listEl} class="max-h-[60vh] overflow-y-auto py-1.5" role="listbox">
        {#each filtered as c, i (c.id)}
          <li>
            <button
              type="button"
              role="option"
              aria-selected={i === activeIdx}
              onclick={() => run(c)}
              onmouseenter={() => (activeIdx = i)}
              class="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition {i === activeIdx ? 'bg-white/[0.07]' : ''}"
            >
              <span class="flex min-w-0 items-center gap-3">
                <ArrowRight class="h-3.5 w-3.5 shrink-0 {i === activeIdx ? 'text-[var(--color-accent-300)]' : 'text-[var(--color-ink-muted)]'}" />
                <span class="truncate text-[var(--color-ink-fg)]">{c.title}</span>
              </span>
              {#if c.hint}
                <span class="shrink-0 font-mono text-[11px] text-[var(--color-ink-muted)]">{c.hint}</span>
              {/if}
            </button>
          </li>
        {:else}
          <li class="px-4 py-6 text-center font-mono text-xs text-[var(--color-ink-muted)]">
            {$t.palette.empty}
          </li>
        {/each}
      </ul>

      <div class="flex items-center justify-between gap-2 border-t border-[var(--color-ink-line)] px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
        <span class="flex items-center gap-3">
          <span>↑↓</span>
          <span>↵</span>
        </span>
        <span>⌘K · ⌃K · /</span>
      </div>
    </div>
  </div>
{/if}
