<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Mail, Send, Github, Copy, Check, FileDown } from 'lucide-svelte';

  let copied = $state(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('me@ishawyha.dev');
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {}
  }
</script>

<section id="contact" class="scroll-mt-nav relative px-6 py-20">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="card relative overflow-hidden p-8 sm:p-12">
        <div class="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full opacity-60 blur-3xl" style="background: radial-gradient(circle, rgba(99,102,241,0.14), transparent 65%);"></div>
        <div class="relative grid gap-10 md:grid-cols-[1.05fr_1fr]">
          <div>
            <span class="kicker">// contact</span>
            <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.contact.title}</h2>
            <p class="mt-4 max-w-md text-base text-[var(--color-body)]">{$t.contact.subtitle}</p>
          </div>

          <ul class="grid gap-3">
            <li class="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/60 p-4">
              <span class="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-indigo-bg)] text-[var(--color-accent-500)]"><Mail class="h-4 w-4" /></span>
              <div class="min-w-0 flex-1">
                <div class="font-mono text-[10px] tracking-[0.14em] text-[var(--color-muted)] uppercase">{$t.contact.emailLabel}</div>
                <a href="mailto:me@ishawyha.dev" class="block truncate text-sm font-medium text-[var(--color-fg)] hover:text-[var(--color-accent-500)]">me@ishawyha.dev</a>
              </div>
              <button type="button" onclick={copyEmail} class="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-muted)] transition hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-500)]" aria-label={$t.contact.copyEmail} title={copied ? $t.contact.copied : $t.contact.copyEmail}>
                {#if copied}<Check class="h-4 w-4 text-emerald-600" />{:else}<Copy class="h-4 w-4" />{/if}
              </button>
            </li>

            <li>
              <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/60 p-4 transition hover:border-[var(--color-accent-400)]">
                <span class="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-sky-bg)] text-[var(--color-sky)]"><Send class="h-4 w-4" /></span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[10px] tracking-[0.14em] text-[var(--color-muted)] uppercase">{$t.contact.telegramLabel}</div>
                  <span class="block truncate text-sm font-medium text-[var(--color-fg)]">@NeShawyha</span>
                </div>
              </a>
            </li>

            <li>
              <a href="https://github.com/OlexiyOdarchuk" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/60 p-4 transition hover:border-[var(--color-accent-400)]">
                <span class="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-bg-soft)] text-[var(--color-fg)]"><Github class="h-4 w-4" /></span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[10px] tracking-[0.14em] text-[var(--color-muted)] uppercase">{$t.contact.githubLabel}</div>
                  <span class="block truncate text-sm font-medium text-[var(--color-fg)]">OlexiyOdarchuk</span>
                </div>
              </a>
            </li>

            <li class="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-soft)]/60 p-4">
              <span class="grid h-10 w-10 place-items-center rounded-lg bg-[var(--color-gold-bg)] text-[var(--color-gold)]"><FileDown class="h-4 w-4" /></span>
              <div class="min-w-0 flex-1">
                <div class="font-mono text-[10px] tracking-[0.14em] text-[var(--color-muted)] uppercase">{$t.contact.cvLabel}</div>
                <div class="mt-0.5 flex flex-wrap gap-x-4 text-sm">
                  <a href="/CV_Odarchuk_UA.pdf" download class="font-medium text-[var(--color-fg)] hover:text-[var(--color-accent-500)]">{$t.contact.cvUa}</a>
                  <a href="/CV_Odarchuk_EN.pdf" download class="font-medium text-[var(--color-fg)] hover:text-[var(--color-accent-500)]">{$t.contact.cvEn}</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Reveal>
  </div>
</section>
