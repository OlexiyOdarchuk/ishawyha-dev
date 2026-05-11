<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import FlowViewer from './FlowViewer.svelte';
  import { loadPiton, runPiton, visualizePiton } from '$lib/piton/runtime';
  import { EXAMPLES, KEYWORDS, type ExampleKey } from '$lib/piton/examples';
  import { Play, GitBranch, Terminal, Loader2, Sparkles, ChevronDown, Share2, Check } from 'lucide-svelte';
  import { onMount } from 'svelte';

  type Status = 'idle' | 'loading' | 'ready' | 'error';
  let status = $state<Status>('idle');
  let vizLoading = $state(false);
  let errorMessage = $state('');

  let code = $state(EXAMPLES.hello);
  let output = $state('');
  let svg = $state('');
  let activeTab = $state<'output' | 'flowchart'>('output');
  let exampleKey = $state<ExampleKey>('hello');
  let lastVisualizedCode = $state('');
  let shareCopied = $state(false);

  // URL hash codec — base64url of utf-8 bytes. Prefix `#code=` so other
  // hashes (e.g. anchor links) don't accidentally trigger restore.
  function encodeShare(src: string): string {
    const bytes = new TextEncoder().encode(src);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeShare(hash: string): string | null {
    try {
      let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    } catch {
      return null;
    }
  }

  async function handleShare() {
    const encoded = encodeShare(code);
    const url = `${location.origin}${location.pathname}#code=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      shareCopied = true;
      setTimeout(() => (shareCopied = false), 1800);
    } catch {
      // fallback: just push to hash so user can copy from address bar
      history.replaceState(null, '', `#code=${encoded}`);
    }
  }

  onMount(() => {
    const m = location.hash.match(/^#code=(.+)$/);
    if (m) {
      const restored = decodeShare(m[1]);
      if (restored) {
        code = restored;
        // Scroll to lab so the visitor sees the loaded snippet immediately.
        requestAnimationFrame(() => {
          document.getElementById('lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  });

  let editorEl: HTMLTextAreaElement | null = $state(null);
  let highlightEl: HTMLPreElement | null = $state(null);
  let gutterEl: HTMLDivElement | null = $state(null);

  const lineCount = $derived(code.length === 0 ? 1 : code.split('\n').length);
  const lineNumbers = $derived(Array.from({ length: lineCount }, (_, i) => i + 1));

  function normalizeSvg(raw: string): string {
    // Drop XML prolog and DOCTYPE so {@html} parses it cleanly inside <body>.
    let cleaned = raw.replace(/^\s*<\?xml[^?]*\?>\s*/i, '');
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/i, '');
    return cleaned.trim();
  }

  const svgIsError = $derived(svg.length > 0 && !svg.trimStart().startsWith('<'));
  const cleanSvg = $derived(svg && !svgIsError ? normalizeSvg(svg) : '');

  function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Single-pass tokenizer — avoids nested spans (e.g. keywords matching inside
  // already-highlighted strings/comments).
  const TOKEN_RE = new RegExp(
    `(?<comment>#[^\\n]*)|(?<str>"[^"\\n]*")|(?<num>\\b\\d+\\.?\\d*\\b)|(?<kw>\\b(?:${KEYWORDS.join('|')})\\b)`,
    'g'
  );

  function highlight(text: string): string {
    const escaped = escapeHtml(text);
    let out = '';
    let last = 0;
    for (const m of escaped.matchAll(TOKEN_RE)) {
      const idx = m.index ?? 0;
      out += escaped.slice(last, idx);
      const tok = m[0];
      if (m.groups?.comment) out += `<span class="tok-comment">${tok}</span>`;
      else if (m.groups?.str) out += `<span class="tok-string">${tok}</span>`;
      else if (m.groups?.num) out += `<span class="tok-num">${tok}</span>`;
      else if (m.groups?.kw) out += `<span class="tok-kw">${tok}</span>`;
      else out += tok;
      last = idx + tok.length;
    }
    out += escaped.slice(last);
    return out + '\n';
  }

  async function ensureLoaded() {
    if (status === 'ready') return true;
    status = 'loading';
    try {
      await loadPiton();
      status = 'ready';
      return true;
    } catch (err) {
      status = 'error';
      errorMessage = err instanceof Error ? err.message : String(err);
      return false;
    }
  }

  async function handleRun() {
    if (!(await ensureLoaded())) return;
    output = runPiton(code);
    activeTab = 'output';
  }

  async function handleVisualize() {
    if (!(await ensureLoaded())) return;
    activeTab = 'flowchart';
    vizLoading = true;
    try {
      svg = await visualizePiton(code);
      lastVisualizedCode = code;
    } catch (err) {
      svg = err instanceof Error ? err.message : String(err);
    } finally {
      vizLoading = false;
    }
  }

  async function selectTab(tab: 'output' | 'flowchart') {
    activeTab = tab;
    if (tab === 'flowchart' && code !== lastVisualizedCode) {
      await handleVisualize();
    }
  }

  function loadExample(key: ExampleKey) {
    exampleKey = key;
    code = EXAMPLES[key];
    output = '';
    svg = '';
    lastVisualizedCode = '';
  }

  function onEditorScroll() {
    if (!editorEl) return;
    if (highlightEl) {
      highlightEl.scrollTop = editorEl.scrollTop;
      highlightEl.scrollLeft = editorEl.scrollLeft;
    }
    if (gutterEl) {
      gutterEl.scrollTop = editorEl.scrollTop;
    }
  }

  function onEditorKey(e: KeyboardEvent) {
    if (!editorEl) return;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      void handleRun();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      void handleVisualize();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editorEl.selectionStart;
      const end = editorEl.selectionEnd;
      const before = code.slice(0, start);
      const after = code.slice(end);
      code = before + '    ' + after;
      requestAnimationFrame(() => {
        if (editorEl) editorEl.selectionStart = editorEl.selectionEnd = start + 4;
      });
    } else if (e.key === 'Enter') {
      const start = editorEl.selectionStart;
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.slice(lineStart, start);
      const indent = currentLine.match(/^\s*/)?.[0] ?? '';
      const extra = currentLine.trimEnd().endsWith(':') ? '    ' : '';
      e.preventDefault();
      const before = code.slice(0, start);
      const after = code.slice(editorEl.selectionEnd);
      code = before + '\n' + indent + extra + after;
      const pos = start + 1 + indent.length + extra.length;
      requestAnimationFrame(() => {
        if (editorEl) editorEl.selectionStart = editorEl.selectionEnd = pos;
      });
    }
  }
</script>

<section id="lab" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-10">
        <span class="font-mono text-sm text-cyan-300">// {$t.lab.kicker}</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.lab.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.lab.subtitle}</p>
      </div>
    </Reveal>

    <Reveal>
      <div class="glass-strong border-gradient relative overflow-hidden rounded-3xl">
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-5 py-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70"></span>
            </div>
            <span class="font-mono text-xs text-[var(--color-muted)]">main.piton</span>

            <!-- Example dropdown -->
            <div class="relative ml-2">
              <select
                class="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-7 pl-3 font-mono text-xs text-white/90 transition hover:border-white/20 focus:outline-none"
                value={exampleKey}
                onchange={(e) => loadExample((e.currentTarget as HTMLSelectElement).value as ExampleKey)}
                aria-label={$t.lab.examples}
              >
                {#each Object.keys(EXAMPLES) as key}
                  <option value={key} class="bg-[#0a0916]">{$t.lab.exampleNames[key as ExampleKey]}</option>
                {/each}
              </select>
              <ChevronDown class="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            {#if status === 'loading'}
              <span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-muted)]">
                <Loader2 class="h-3.5 w-3.5 animate-spin" />
                {$t.lab.loading}
              </span>
            {:else if status === 'ready'}
              <span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {$t.lab.loaded}
              </span>
            {:else if status === 'error'}
              <span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-red-300">
                ⚠ {$t.lab.error}
              </span>
            {/if}

            <button
              type="button"
              onclick={handleRun}
              disabled={status === 'loading'}
              title="Ctrl + Enter"
              class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-violet-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {#if status === 'loading'}
                <Loader2 class="h-3.5 w-3.5 animate-spin" />
              {:else}
                <Play class="h-3.5 w-3.5" />
              {/if}
              {$t.lab.run}
            </button>

            <button
              type="button"
              onclick={handleVisualize}
              disabled={status === 'loading' || vizLoading}
              title="Ctrl + B"
              class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/90 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {#if vizLoading}
                <Loader2 class="h-3.5 w-3.5 animate-spin" />
              {:else}
                <GitBranch class="h-3.5 w-3.5" />
              {/if}
              {$t.lab.visualize}
            </button>

            <button
              type="button"
              onclick={handleShare}
              title={$t.lab.share}
              aria-label={$t.lab.share}
              class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/90 transition hover:border-white/20 hover:bg-white/[0.08]"
            >
              {#if shareCopied}
                <Check class="h-3.5 w-3.5 text-emerald-300" />
                {$t.lab.shared}
              {:else}
                <Share2 class="h-3.5 w-3.5" />
                {$t.lab.share}
              {/if}
            </button>
          </div>
        </div>

        {#if status === 'idle'}
          <div class="border-b border-white/5 bg-violet-500/5 px-5 py-2 font-mono text-[11px] text-violet-200">
            <Sparkles class="mr-1 inline h-3 w-3" />
            {$t.lab.loadHint}
          </div>
        {/if}

        <!-- Lab body: editor + viewer -->
        <div class="grid lg:grid-cols-2">
          <!-- Editor -->
          <div class="relative flex h-[460px] overflow-hidden border-b border-white/5 lg:border-r lg:border-b-0">
            <div
              bind:this={gutterEl}
              class="piton-gutter pointer-events-none flex-none overflow-hidden py-5 pr-3 pl-4 font-mono text-[13px] leading-[1.6] text-right select-none"
              aria-hidden="true"
            >
              {#each lineNumbers as n (n)}
                <div class="piton-line-num">{n}</div>
              {/each}
            </div>
            <div class="relative flex-1">
              <pre
                bind:this={highlightEl}
                class="piton-overlay pointer-events-none absolute inset-0 m-0 overflow-auto py-5 pr-5 pl-2 font-mono text-[13px] leading-[1.6] whitespace-pre"
                aria-hidden="true">{@html highlight(code)}</pre>
              <textarea
                bind:this={editorEl}
                bind:value={code}
                onscroll={onEditorScroll}
                onkeydown={onEditorKey}
                spellcheck="false"
                aria-label="Piton code editor"
                class="piton-editor relative h-full w-full resize-none bg-transparent py-5 pr-5 pl-2 font-mono text-[13px] leading-[1.6] text-transparent caret-white outline-none"
                autocomplete="off"
                autocapitalize="off"
                {...{ autocorrect: 'off' }}
              ></textarea>
            </div>
          </div>

          <!-- Viewer -->
          <div class="flex h-[460px] flex-col">
            <div role="tablist" class="flex border-b border-white/5 bg-white/[0.015]">
              <button
                role="tab"
                type="button"
                aria-selected={activeTab === 'output'}
                onclick={() => selectTab('output')}
                class="inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-mono text-xs transition {activeTab === 'output' ? 'border-violet-400 text-white' : 'border-transparent text-[var(--color-muted)] hover:text-white'}"
              >
                <Terminal class="h-3.5 w-3.5" />
                {$t.lab.output}
              </button>
              <button
                role="tab"
                type="button"
                aria-selected={activeTab === 'flowchart'}
                onclick={() => selectTab('flowchart')}
                class="inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-mono text-xs transition {activeTab === 'flowchart' ? 'border-pink-400 text-white' : 'border-transparent text-[var(--color-muted)] hover:text-white'}"
              >
                <GitBranch class="h-3.5 w-3.5" />
                {$t.lab.flowchart}
              </button>
            </div>

            <div class="relative flex-1 overflow-hidden">
              {#if activeTab === 'output'}
                <pre class="m-0 h-full overflow-auto p-5 font-mono text-[13px] leading-[1.6] whitespace-pre-wrap text-emerald-200/90">{output || $t.lab.emptyOutput}</pre>
              {:else if vizLoading && !svg}
                <div class="grid h-full place-items-center p-5">
                  <span class="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)]">
                    <Loader2 class="h-3.5 w-3.5 animate-spin" />
                    {$t.lab.loadingViz}
                  </span>
                </div>
              {:else if status === 'loading' && !svg}
                <div class="grid h-full place-items-center p-5">
                  <span class="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-muted)]">
                    <Loader2 class="h-3.5 w-3.5 animate-spin" />
                    {$t.lab.loading}
                  </span>
                </div>
              {:else if svg && svgIsError}
                <pre class="m-0 h-full overflow-auto p-5 font-mono text-[12px] leading-[1.6] whitespace-pre-wrap text-red-300">{svg}</pre>
              {:else if svg}
                <FlowViewer svg={cleanSvg} />
              {:else}
                <div class="grid h-full place-items-center p-5">
                  <p class="font-mono text-xs text-[var(--color-muted)]">{$t.lab.emptyFlow}</p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </Reveal>

    {#if status === 'error' && errorMessage}
      <p class="mt-3 font-mono text-xs text-red-300">{errorMessage}</p>
    {/if}
  </div>
</section>

<style>
  :global(.piton-overlay) {
    color: rgb(229 231 235);
  }
  :global(.piton-overlay .tok-kw) {
    color: #f9a8d4;
    font-weight: 600;
  }
  :global(.piton-overlay .tok-string) {
    color: #6ee7b7;
  }
  :global(.piton-overlay .tok-num) {
    color: #67e8f9;
  }
  :global(.piton-overlay .tok-comment) {
    color: #6b7280;
    font-style: italic;
  }
  .piton-gutter {
    color: rgba(138, 134, 180, 0.55);
    background: rgba(255, 255, 255, 0.015);
    border-right: 1px solid rgba(255, 255, 255, 0.04);
    width: 3.25rem;
    min-width: 3.25rem;
  }
  .piton-line-num {
    height: calc(13px * 1.6);
    font-variant-numeric: tabular-nums;
  }
  .piton-editor::selection {
    background: rgba(139, 92, 246, 0.45);
    color: transparent;
  }
  /* iOS Safari auto-zooms inputs whose computed font-size is < 16px on focus.
     Bump the textarea and its hidden highlight overlay to 16px on coarse
     pointers (phones/tablets) so the page never zooms on edit. */
  @media (pointer: coarse) {
    :global(.piton-overlay),
    .piton-editor,
    .piton-gutter {
      font-size: 16px !important;
    }
  }
</style>
