<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { generate, type LoadStage } from '$lib/rombik/runtime';
  import {
    Workflow,
    Route,
    FileDown,
    ShieldCheck,
    Play,
    Loader2,
    ChevronDown,
    ExternalLink,
    Github
  } from 'lucide-svelte';

  const APP = 'https://rombik.ishawyha.dev/app';
  const REPO = 'https://github.com/OlexiyOdarchuk/rombik';

  const icons = [Workflow, Route, FileDown, ShieldCheck];

  type ExampleKey = 'grade' | 'loop' | 'factorial';
  const EXAMPLES: Record<ExampleKey, string> = {
    grade: `def grade(score):
    name = input("Ваше ім'я: ")
    print("Привіт,", name)
    total = score + 5
    if total >= 90:
        print("Відмінно")
    else:
        if total >= 60:
            print("Задовільно")
        else:
            print("Незадовільно")
    print("Готово")`,
    loop: `def suma(n):
    s = 0
    for i in range(1, n + 1):
        s = s + i
    print("Сума:", s)
    return s`,
    factorial: `def factorial(n):
    result = 1
    while n > 1:
        result = result * n
        n = n - 1
    return result`
  };

  type Status = 'idle' | 'loading' | 'ready' | 'error';
  let status = $state<Status>('idle');
  let stage = $state<LoadStage | ''>('');
  let code = $state(EXAMPLES.grade);
  let exampleKey = $state<ExampleKey>('grade');
  let svgs = $state<{ name: string; svg: string }[]>([]);
  let errorMsg = $state('');

  function loadExample(key: ExampleKey) {
    exampleKey = key;
    code = EXAMPLES[key];
  }

  function stageLabel(s: LoadStage | ''): string {
    if (s === 'python') return $t.lab.rombik.loadingPython;
    if (s === 'engine') return $t.lab.rombik.loadingEngine;
    if (s === 'build') return $t.lab.rombik.building;
    return $t.lab.rombik.building;
  }

  async function run() {
    if (status === 'loading') return;
    status = 'loading';
    errorMsg = '';
    try {
      const res = await generate(code, (s) => (stage = s));
      if (res.error) {
        errorMsg = res.error;
        svgs = [];
      } else {
        svgs = res.functions ?? [];
        errorMsg = '';
      }
      status = 'ready';
    } catch (e) {
      errorMsg = String((e as Error)?.message ?? e);
      status = 'error';
    }
  }

  let editorEl: HTMLTextAreaElement | null = $state(null);
  let highlightEl: HTMLPreElement | null = $state(null);
  let gutterEl: HTMLDivElement | null = $state(null);

  const lineCount = $derived(code.length === 0 ? 1 : code.split('\n').length);
  const lineNumbers = $derived(Array.from({ length: lineCount }, (_, i) => i + 1));

  function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  const PYTHON_KEYWORDS = [
    'def', 'return', 'if', 'else', 'elif', 'for', 'in', 'while', 'break', 'continue',
    'pass', 'and', 'or', 'not', 'is', 'import', 'from', 'as', 'True', 'False', 'None',
    'print', 'input', 'range'
  ];

  const TOKEN_RE = new RegExp(
    `(?<comment>#[^\\n]*)|(?<str>"[^"\\n]*"|'[^'\\n]*')|(?<num>\\b\\d+\\.?\\d*\\b)|(?<kw>\\b(?:${PYTHON_KEYWORDS.join('|')})\\b)`,
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
      void run();
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

  import { onMount } from 'svelte';
  onMount(() => {
    if (typeof location !== 'undefined' && location.search.includes('rombikauto')) run();
  });
</script>

<section id="rombik" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-8">
        <span class="font-mono text-sm text-rose-300">// {$t.lab.rombik.kicker}</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.lab.rombik.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.lab.rombik.subtitle}</p>
      </div>
    </Reveal>

    <!-- Strongest, accurate technical points -->
    <Reveal>
      <ul class="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {#each $t.lab.rombik.highlights as h, i}
          {@const Icon = icons[i]}
          <li class="glass flex items-start gap-3 rounded-2xl p-4">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-500/15 text-rose-200">
              <Icon class="h-4 w-4" />
            </span>
            <div>
              <div class="text-sm font-semibold text-white">{h.title}</div>
              <div class="mt-0.5 text-xs leading-snug text-[var(--color-muted)]">{h.desc}</div>
            </div>
          </li>
        {/each}
      </ul>
    </Reveal>

    <!-- Native lab: Python editor → DSTU flowchart (SVG) -->
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
            <span class="font-mono text-xs text-[var(--color-muted)]">{$t.lab.rombik.filename}</span>

            <div class="relative ml-2">
              <select
                class="cursor-pointer appearance-none rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-7 pl-3 font-mono text-xs text-white/90 transition hover:border-white/20 focus:outline-none"
                value={exampleKey}
                onchange={(e) => loadExample((e.currentTarget as HTMLSelectElement).value as ExampleKey)}
                aria-label="examples"
              >
                {#each Object.keys(EXAMPLES) as key}
                  <option value={key} class="bg-[#0a0916]">{$t.lab.rombik.examples[key as ExampleKey]}</option>
                {/each}
              </select>
              <ChevronDown class="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-muted)]" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            {#if status === 'loading'}
              <span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-muted)]">
                <Loader2 class="h-3.5 w-3.5 animate-spin" />
                {stageLabel(stage)}
              </span>
            {:else if status === 'ready' && svgs.length}
              <span class="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {$t.lab.rombik.ready}
              </span>
            {/if}

            <button
              type="button"
              onclick={run}
              disabled={status === 'loading'}
              title="Ctrl + Enter"
              class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-rose-500/25 transition hover:scale-105 hover:shadow-amber-500/30 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {#if status === 'loading'}
                <Loader2 class="h-4 w-4 animate-spin" />
              {:else}
                <Play class="h-4 w-4" />
              {/if}
              {$t.lab.rombik.run}
            </button>
          </div>
        </div>

        {#if status === 'idle'}
          <div class="border-b border-white/5 bg-rose-500/5 px-5 py-2 font-mono text-[11px] text-rose-200">
            {$t.lab.rombik.weightHint}
          </div>
        {/if}

        <!-- Body: editor (left) + flowchart on a white sheet (right) -->
        <div class="grid lg:grid-cols-2">
          <div class="relative flex h-[460px] overflow-hidden border-b border-white/5 lg:border-r lg:border-b-0">
            <div
              bind:this={gutterEl}
              class="rombik-gutter pointer-events-none flex-none overflow-hidden py-5 pr-3 pl-4 font-mono text-[13px] leading-[1.6] text-right select-none"
              aria-hidden="true"
            >
              {#each lineNumbers as n (n)}
                <div class="rombik-line-num">{n}</div>
              {/each}
            </div>
            <div class="relative flex-1">
              <pre
                bind:this={highlightEl}
                class="rombik-overlay pointer-events-none absolute inset-0 m-0 overflow-auto py-5 pr-5 pl-2 font-mono text-[13px] leading-[1.6] whitespace-pre"
                aria-hidden="true">{@html highlight(code)}</pre>
              <textarea
                bind:this={editorEl}
                bind:value={code}
                onscroll={onEditorScroll}
                onkeydown={onEditorKey}
                spellcheck="false"
                aria-label="Python code editor"
                class="rombik-editor relative h-full w-full resize-none bg-transparent py-5 pr-5 pl-2 font-mono text-[13px] leading-[1.6] text-transparent caret-white outline-none"
                autocomplete="off"
                autocapitalize="off"
                {...{ autocorrect: 'off' }}
              ></textarea>
            </div>
          </div>

          <div class="h-[460px] overflow-auto bg-[#0a0916]/40 p-4">
            {#if errorMsg}
              <div class="flex h-full items-center justify-center px-6 text-center">
                <p class="font-mono text-sm text-red-300">⚠ {errorMsg}</p>
              </div>
            {:else if svgs.length}
              <div class="flex flex-col gap-4">
                {#each svgs as fn}
                  <div class="overflow-hidden rounded-xl bg-white p-4">
                    {#if fn.name}
                      <div class="mb-2 font-mono text-[11px] text-black/50">{fn.name}</div>
                    {/if}
                    <div class="rombik-svg overflow-auto">
                      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                      {@html fn.svg}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="flex h-full items-center justify-center px-6 text-center">
                <p class="text-sm text-[var(--color-muted)]">{$t.lab.rombik.emptyOutput}</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Footer CTAs -->
        <div class="flex flex-wrap items-center gap-3 border-t border-white/5 bg-white/[0.02] px-5 py-3">
          <a
            href={APP}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/90 transition hover:scale-105 hover:border-white/30 hover:bg-white/10"
          >
            <ExternalLink class="h-4 w-4" />
            {$t.lab.rombik.openApp}
          </a>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white/90 transition hover:scale-105 hover:border-white/30 hover:bg-white/10"
          >
            <Github class="h-4 w-4" />
            {$t.lab.rombik.source}
          </a>
        </div>
      </div>
    </Reveal>
  </div>
</section>

<style>
  .rombik-svg :global(svg) {
    max-width: 100%;
    height: auto;
  }
  :global(.rombik-overlay) {
    color: rgb(229 231 235);
  }
  :global(.rombik-overlay .tok-kw) {
    color: #f9a8d4;
    font-weight: 600;
  }
  :global(.rombik-overlay .tok-string) {
    color: #6ee7b7;
  }
  :global(.rombik-overlay .tok-num) {
    color: #67e8f9;
  }
  :global(.rombik-overlay .tok-comment) {
    color: #6b7280;
    font-style: italic;
  }
  .rombik-gutter {
    color: rgba(138, 134, 180, 0.55);
    background: rgba(255, 255, 255, 0.015);
    border-right: 1px solid rgba(255, 255, 255, 0.04);
    width: 3.25rem;
    min-width: 3.25rem;
  }
  .rombik-line-num {
    height: calc(13px * 1.6);
    font-variant-numeric: tabular-nums;
  }
  .rombik-editor::selection {
    background: rgba(139, 92, 246, 0.45);
    color: transparent;
  }
  @media (pointer: coarse) {
    :global(.rombik-overlay),
    .rombik-editor,
    .rombik-gutter {
      font-size: 16px !important;
    }
  }
</style>
