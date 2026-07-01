<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { DEMOS } from '$lib/rombik/demo';
  import { Workflow, Route, FileDown, ShieldCheck, Play, ExternalLink, Code2, ChevronDown } from 'lucide-svelte';

  // showHeader=false embeds just the demo (no section title/highlights) — used on /rombik.
  let { showHeader = true }: { showHeader?: boolean } = $props();

  const APP = 'https://rombik.app/app';
  const API = 'https://rombik.app/api/v1/openapi.json';

  const icons = [Workflow, Route, FileDown, ShieldCheck];

  // Friendly function-name labels (language-neutral — work for UA & EN).
  const fnName: Record<string, string> = {
    grade: 'grade()',
    suma: 'sum()',
    factorial: 'factorial()',
    bubble: 'bubble_sort()',
    prime: 'is_prime()',
    gcd: 'gcd()'
  };

  let idx = $state(0);
  let animId = $state(0); // bump to replay the "build" reveal animation
  const demo = $derived(DEMOS[idx]);

  function select(i: number) {
    idx = i;
    animId++;
  }
  function rebuild() {
    animId++;
    if (typeof window !== 'undefined') window.gtag?.('event', 'click_rombik_run');
  }

  // --- "Open in rombik" share link -----------------------------------------
  // rombik web app reads #s=<urlencoded base64(deflate-raw(JSON{code,language,settings}))>.
  // We reproduce its encodeShare with the native CompressionStream — no deps.
  let shareBusy = $state(false);
  async function openInRombik() {
    shareBusy = true;
    try {
      const payload = JSON.stringify({ code: demo.code, language: demo.lang, settings: {} });
      const bytes = new TextEncoder().encode(payload);
      const compressed = new Uint8Array(
        await new Response(
          new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))
        ).arrayBuffer()
      );
      let bin = '';
      for (const b of compressed) bin += String.fromCharCode(b);
      const url = `${APP}#s=${encodeURIComponent(btoa(bin))}`;
      if (typeof window !== 'undefined') window.gtag?.('event', 'click_rombik_open_share');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(APP, '_blank', 'noopener,noreferrer');
    } finally {
      shareBusy = false;
    }
  }
  // -------------------------------------------------------------------------

  function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // Per-language keywords + comment syntax — rombik now reads 6 languages.
  const KEYWORDS: Record<string, string[]> = {
    python: ['def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'break', 'continue',
      'pass', 'and', 'or', 'not', 'is', 'import', 'from', 'as', 'True', 'False', 'None',
      'print', 'input', 'range', 'len'],
    cfamily: ['int', 'void', 'char', 'float', 'double', 'bool', 'long', 'short', 'unsigned',
      'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
      'true', 'false', 'null', 'class', 'struct', 'public', 'private', 'static', 'new', 'const'],
    pascal: ['program', 'function', 'procedure', 'begin', 'end', 'var', 'const', 'type',
      'if', 'then', 'else', 'for', 'to', 'downto', 'do', 'while', 'repeat', 'until', 'case', 'of',
      'and', 'or', 'not', 'mod', 'div', 'exit', 'true', 'false', 'integer', 'boolean', 'real', 'string']
  };
  function tokenRe(lang: string): RegExp {
    const kw = lang === 'pascal' ? KEYWORDS.pascal : lang === 'python' ? KEYWORDS.python : KEYWORDS.cfamily;
    const comment = lang === 'python' ? '#[^\\n]*' : lang === 'pascal' ? '\\{[^}]*\\}|//[^\\n]*' : '//[^\\n]*';
    return new RegExp(
      `(?<comment>${comment})|(?<str>"[^"\\n]*"|'[^'\\n]*')|(?<num>\\b\\d+\\.?\\d*\\b)|(?<kw>\\b(?:${kw.join('|')})\\b)`,
      'g'
    );
  }
  function highlight(text: string, lang: string): string {
    const escaped = escapeHtml(text);
    let out = '';
    let last = 0;
    for (const m of escaped.matchAll(tokenRe(lang))) {
      const i = m.index ?? 0;
      out += escaped.slice(last, i);
      const tok = m[0];
      if (m.groups?.comment) out += `<span class="tok-comment">${tok}</span>`;
      else if (m.groups?.str) out += `<span class="tok-string">${tok}</span>`;
      else if (m.groups?.num) out += `<span class="tok-num">${tok}</span>`;
      else if (m.groups?.kw) out += `<span class="tok-kw">${tok}</span>`;
      else out += tok;
      last = i + tok.length;
    }
    return out + escaped.slice(last);
  }
  const highlighted = $derived(highlight(demo.code, demo.lang));
  const lineNumbers = $derived(demo.code.split('\n').map((_, i) => i + 1));
</script>

<section id="rombik" class="scroll-mt-nav relative px-6 py-20">
  <div class="mx-auto max-w-6xl">
    {#if showHeader}
    <Reveal>
      <div class="mb-3 flex items-center gap-3">
        <span class="kicker">// {$t.lab.rombik.kicker}</span>
      </div>
      <h2 class="display max-w-3xl text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.lab.rombik.title}</h2>
      <p class="mt-4 max-w-2xl text-base text-[var(--color-muted)]">{$t.lab.rombik.subtitle}</p>
    </Reveal>

    <!-- Highlights -->
    <Reveal>
      <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each $t.lab.rombik.highlights as h, i}
          {@const Icon = icons[i]}
          <li class="card flex flex-col gap-2 p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-accent-400)]/12 text-[var(--color-accent-500)]"><Icon class="h-4 w-4" /></span>
            <div class="mt-1 text-sm font-bold text-[var(--color-fg)]">{h.title}</div>
            <div class="text-xs leading-snug text-[var(--color-muted)]">{h.desc}</div>
          </li>
        {/each}
      </ul>
    </Reveal>
    {/if}

    <!-- Demo: prebuilt code → flowchart (theme-aware surface, no engine) -->
    <Reveal>
      <div class="card mt-5 overflow-hidden p-0">
        <!-- Toolbar: example tabs -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] bg-[var(--color-bg-soft)]/50 px-4 py-3">
          <div class="flex flex-wrap items-center gap-1.5">
            {#each DEMOS as d, i}
              <button
                type="button"
                onclick={() => select(i)}
                class="rounded-full px-3 py-1.5 font-mono text-xs transition {idx === i
                  ? 'bg-[var(--color-accent-400)] font-semibold text-white'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-card)] hover:text-[var(--color-fg)]'}"
              >
                {fnName[d.key] ?? d.key}
              </button>
            {/each}
          </div>
          <button type="button" onclick={rebuild} class="btn-ghost text-xs" title="{$t.lab.rombik.build}">
            <Play class="h-3.5 w-3.5" />
            {$t.lab.rombik.build}
          </button>
        </div>

        <div class="border-b border-[var(--color-line)] bg-[var(--color-accent-400)]/[0.05] px-4 py-2 font-mono text-[11px] text-[var(--color-accent-500)]">
          {$t.lab.rombik.demoHint}
        </div>

        <!-- Body -->
        <div class="grid lg:grid-cols-2">
          <!-- Code (static, highlighted, theme-aware) -->
          <div class="flex max-h-[460px] overflow-auto border-b border-[var(--color-line)] bg-[var(--color-ink)] lg:border-r lg:border-b-0">
            <div class="rombik-gutter pointer-events-none flex-none py-5 pr-3 pl-4 text-right font-mono text-[13px] leading-[1.65] select-none" aria-hidden="true">
              {#each lineNumbers as n (n)}<div>{n}</div>{/each}
            </div>
            <pre class="rombik-code m-0 flex-1 overflow-x-auto py-5 pr-5 pl-2 font-mono text-[13px] leading-[1.65] whitespace-pre">{@html highlighted}</pre>
          </div>

          <!-- Flowchart sheet with build-reveal animation -->
          <div class="flex max-h-[460px] items-start justify-center overflow-auto bg-[var(--color-ink-soft)] p-5">
            {#key animId}
              <div class="rombik-sheet w-full overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                {@html demo.svg}
              </div>
            {/key}
          </div>
        </div>

        <!-- Footer CTAs -->
        <div class="flex flex-wrap items-center gap-3 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]/50 px-4 py-3">
          <button type="button" onclick={openInRombik} disabled={shareBusy} class="btn-primary disabled:opacity-60">
            <ExternalLink class="h-4 w-4" />
            {$t.lab.rombik.tryRombik}
          </button>
          <a href={APP} target="_blank" rel="noopener noreferrer" onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_rombik_open_app')} class="btn-secondary">
            {$t.lab.rombik.openApp}
          </a>
          <a href={API} target="_blank" rel="noopener noreferrer" onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_rombik_api')} class="btn-ghost">
            <Code2 class="h-4 w-4" />
            {$t.lab.rombik.api}
          </a>
        </div>
      </div>
    </Reveal>
  </div>
</section>

<style>
  .rombik-sheet :global(svg) {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  /* «Будує схему»: проявлення зверху вниз. */
  .rombik-sheet {
    animation: sheet-build 1.05s cubic-bezier(0.45, 0, 0.2, 1) backwards;
  }
  @keyframes sheet-build {
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0 0); }
  }
  .rombik-gutter {
    color: var(--color-ink-muted);
    background: color-mix(in srgb, var(--color-ink-soft) 60%, transparent);
    border-right: 1px solid var(--color-ink-line);
    width: 3.25rem;
    min-width: 3.25rem;
  }
  .rombik-code {
    color: var(--color-ink-fg);
  }
  :global(.rombik-code .tok-kw) { color: var(--tok-kw); font-weight: 600; }
  :global(.rombik-code .tok-string) { color: var(--tok-str); }
  :global(.rombik-code .tok-num) { color: var(--tok-num); }
  :global(.rombik-code .tok-comment) { color: var(--tok-comment); font-style: italic; }
  @media (prefers-reduced-motion: reduce) {
    .rombik-sheet { animation-duration: 0.01s; }
  }
  @media (pointer: coarse) {
    .rombik-code, .rombik-gutter { font-size: 16px !important; }
  }
</style>
