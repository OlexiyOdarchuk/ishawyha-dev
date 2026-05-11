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

<section id="contact" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div
        class="glass-strong border-gradient relative overflow-hidden rounded-3xl p-8 sm:p-12"
      >
        <div class="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-pink-500/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"></div>

        <div class="relative grid gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span class="text-gradient">{$t.contact.title}</span>
            </h2>
            <p class="mt-4 max-w-md text-base text-white/80">{$t.contact.subtitle}</p>
          </div>

          <ul class="grid gap-3">
            <li>
              <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span class="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/20 text-violet-200">
                  <Mail class="h-4 w-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                    {$t.contact.emailLabel}
                  </div>
                  <a href="mailto:me@ishawyha.dev" class="block truncate text-sm text-white hover:text-violet-200">
                    me@ishawyha.dev
                  </a>
                </div>
                <button
                  type="button"
                  onclick={copyEmail}
                  class="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white"
                  aria-label={$t.contact.copyEmail}
                  title={copied ? $t.contact.copied : $t.contact.copyEmail}
                >
                  {#if copied}
                    <Check class="h-4 w-4 text-emerald-300" />
                  {:else}
                    <Copy class="h-4 w-4" />
                  {/if}
                </button>
              </div>
            </li>

            <li>
              <a
                href="https://t.me/NeShawyha"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span class="grid h-10 w-10 place-items-center rounded-xl bg-cyan-500/20 text-cyan-200">
                  <Send class="h-4 w-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                    {$t.contact.telegramLabel}
                  </div>
                  <span class="block truncate text-sm text-white">@NeShawyha</span>
                </div>
              </a>
            </li>

            <li>
              <a
                href="https://github.com/OlexiyOdarchuk"
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <span class="grid h-10 w-10 place-items-center rounded-xl bg-pink-500/20 text-pink-200">
                  <Github class="h-4 w-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                    {$t.contact.githubLabel}
                  </div>
                  <span class="block truncate text-sm text-white">github.com/OlexiyOdarchuk</span>
                </div>
              </a>
            </li>

            <li>
              <div class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span class="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-200">
                  <FileDown class="h-4 w-4" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                    {$t.contact.cvLabel}
                  </div>
                  <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    <a href="/CV_Odarchuk_UA.pdf" download class="text-white hover:text-amber-200">
                      {$t.contact.cvUa}
                    </a>
                    <a href="/CV_Odarchuk_EN.pdf" download class="text-white hover:text-amber-200">
                      {$t.contact.cvEn}
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Reveal>
  </div>
</section>
