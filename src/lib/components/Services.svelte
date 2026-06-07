<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Bot, Server, LayoutTemplate, Workflow, Send, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-svelte';

  // Same Cloudflare Worker that SHMiner posts telemetry to — it forwards to my
  // Telegram. We just send a different payload `type` ("order"), handled there.
  const ENDPOINT = 'https://s-uah-miner-telemetry.ishawyha.workers.dev';

  const cards = [
    { key: 'bots', icon: Bot, accent: 'cyan' },
    { key: 'backend', icon: Server, accent: 'emerald' },
    { key: 'web', icon: LayoutTemplate, accent: 'violet' },
    { key: 'automation', icon: Workflow, accent: 'amber' }
  ] as const;

  const accentClasses: Record<string, { ring: string; glow: string; chip: string }> = {
    cyan: { ring: 'hover:border-cyan-400/40', glow: 'from-cyan-500/12 to-emerald-500/8', chip: 'bg-cyan-500/15 text-cyan-200' },
    emerald: { ring: 'hover:border-emerald-400/40', glow: 'from-emerald-500/12 to-cyan-500/8', chip: 'bg-emerald-500/15 text-emerald-200' },
    violet: { ring: 'hover:border-violet-400/40', glow: 'from-violet-500/12 to-pink-500/8', chip: 'bg-violet-500/15 text-violet-200' },
    amber: { ring: 'hover:border-amber-400/40', glow: 'from-amber-500/15 to-rose-500/8', chip: 'bg-amber-500/15 text-amber-200' }
  };

  type Status = 'idle' | 'sending' | 'success' | 'error';

  let name = $state('');
  let contact = $state('');
  let service = $state('');
  let budget = $state('');
  let message = $state('');
  let company = $state(''); // honeypot — stays hidden, real users never fill it
  let status = $state<Status>('idle');
  let touched = $state(false);

  const serviceOptions = $derived([
    ...cards.map((c) => $t.services.list[c.key].title),
    $t.services.form.serviceOther
  ]);

  const nameValid = $derived(name.trim().length > 0);
  const contactValid = $derived(contact.trim().length > 0);
  const messageValid = $derived(message.trim().length > 0);
  const formValid = $derived(nameValid && contactValid && messageValid);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    touched = true;
    if (!formValid || status === 'sending') return;

    status = 'sending';
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          name: name.trim(),
          contact: contact.trim(),
          service: service || '—',
          budget: budget.trim(),
          message: message.trim(),
          company // honeypot
        })
      });
      if (!res.ok) throw new Error(String(res.status));
      status = 'success';
      name = contact = service = budget = message = '';
      touched = false;
    } catch {
      status = 'error';
    }
  }

  function reset() {
    status = 'idle';
  }

  const fieldBase =
    'w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-[var(--color-muted)] transition focus:outline-none focus:ring-2 focus:ring-violet-400/40';
  const fieldOk = 'border-white/10 focus:border-violet-400/50';
  const fieldErr = 'border-rose-400/50 focus:border-rose-400/60';
</script>

<section id="services" class="scroll-mt-nav relative px-6 py-24">
  <div class="mx-auto max-w-6xl">
    <Reveal>
      <div class="mb-12">
        <span class="font-mono text-sm text-emerald-300">{$t.services.kicker}</span>
        <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{$t.services.title}</h2>
        <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.services.subtitle}</p>
      </div>
    </Reveal>

    <!-- Service cards -->
    <div class="mb-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {#each cards as card, i}
        {@const item = $t.services.list[card.key]}
        {@const a = accentClasses[card.accent]}
        <Reveal delay={i * 70}>
          <div class="glass group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 hover:bg-white/[0.06] {a.ring}">
            <div class="pointer-events-none absolute -top-20 -right-12 h-44 w-44 rounded-full bg-gradient-to-br {a.glow} blur-3xl"></div>
            <span class="relative grid h-11 w-11 place-items-center rounded-2xl {a.chip}">
              <card.icon class="h-5 w-5" />
            </span>
            <h3 class="relative mt-4 text-lg font-semibold text-white">{item.title}</h3>
            <p class="relative mt-2 flex-1 text-sm leading-relaxed text-white/75">{item.description}</p>
            <ul class="relative mt-4 flex flex-wrap gap-1.5">
              {#each item.tags as tag}
                <li class="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/70">{tag}</li>
              {/each}
            </ul>
          </div>
        </Reveal>
      {/each}
    </div>

    <!-- Order form -->
    <Reveal>
      <div class="glass-strong border-gradient relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div class="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative">
          {#if status === 'success'}
            <div class="flex flex-col items-center py-10 text-center">
              <span class="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Check class="h-7 w-7" />
              </span>
              <h3 class="mt-5 text-2xl font-bold text-white">{$t.services.form.successTitle}</h3>
              <p class="mt-2 max-w-md text-sm text-white/75">{$t.services.form.successBody}</p>
              <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onclick={reset}
                  class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10"
                >
                  {$t.services.form.again}
                </button>
                <a
                  href="https://t.me/NeShawyha"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Send class="h-4 w-4" />
                  {$t.services.form.altTelegram}
                </a>
              </div>
            </div>
          {:else}
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-white">{$t.services.form.title}</h3>
              <p class="mt-1.5 text-sm text-[var(--color-muted)]">{$t.services.form.subtitle}</p>
            </div>

            <form onsubmit={submit} novalidate class="grid gap-4 sm:grid-cols-2">
              <!-- Honeypot: visually hidden, off-screen, not tabbable -->
              <div class="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                <label>
                  Company
                  <input bind:value={company} type="text" tabindex="-1" autocomplete="off" />
                </label>
              </div>

              <div>
                <label for="svc-name" class="mb-1.5 block text-xs font-medium text-white/80">{$t.services.form.name}</label>
                <input
                  id="svc-name"
                  bind:value={name}
                  type="text"
                  placeholder={$t.services.form.namePlaceholder}
                  class="{fieldBase} {touched && !nameValid ? fieldErr : fieldOk}"
                />
              </div>

              <div>
                <label for="svc-contact" class="mb-1.5 block text-xs font-medium text-white/80">{$t.services.form.contact}</label>
                <input
                  id="svc-contact"
                  bind:value={contact}
                  type="text"
                  placeholder={$t.services.form.contactPlaceholder}
                  class="{fieldBase} {touched && !contactValid ? fieldErr : fieldOk}"
                />
              </div>

              <div>
                <label for="svc-type" class="mb-1.5 block text-xs font-medium text-white/80">{$t.services.form.service}</label>
                <select
                  id="svc-type"
                  bind:value={service}
                  class="{fieldBase} {fieldOk} appearance-none"
                >
                  <option value="" disabled selected>{$t.services.form.servicePlaceholder}</option>
                  {#each serviceOptions as opt}
                    <option value={opt} class="bg-[#0a0916] text-white">{opt}</option>
                  {/each}
                </select>
              </div>

              <div>
                <label for="svc-budget" class="mb-1.5 block text-xs font-medium text-white/80">{$t.services.form.budget}</label>
                <input
                  id="svc-budget"
                  bind:value={budget}
                  type="text"
                  placeholder={$t.services.form.budgetPlaceholder}
                  class="{fieldBase} {fieldOk}"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="svc-msg" class="mb-1.5 block text-xs font-medium text-white/80">{$t.services.form.message}</label>
                <textarea
                  id="svc-msg"
                  bind:value={message}
                  rows="4"
                  placeholder={$t.services.form.messagePlaceholder}
                  class="{fieldBase} {touched && !messageValid ? fieldErr : fieldOk} resize-y"
                ></textarea>
              </div>

              {#if status === 'error'}
                <div class="sm:col-span-2 flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                  <div>
                    <div class="font-semibold">{$t.services.form.errorTitle}</div>
                    <div class="text-rose-100/80">
                      {$t.services.form.errorBody}
                      <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" class="underline hover:text-white">@NeShawyha</a>
                    </div>
                  </div>
                </div>
              {/if}

              <div class="sm:col-span-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  class="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {#if status === 'sending'}
                    <Loader2 class="h-4 w-4 animate-spin" />
                    {$t.services.form.sending}
                  {:else}
                    <Send class="h-4 w-4" />
                    {$t.services.form.submit}
                    <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
                  {/if}
                </button>
                <a
                  href="https://t.me/NeShawyha"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                >
                  <Send class="h-4 w-4" />
                  {$t.services.form.altTelegram}
                </a>
              </div>
            </form>
          {/if}
        </div>
      </div>
    </Reveal>
  </div>
</section>
