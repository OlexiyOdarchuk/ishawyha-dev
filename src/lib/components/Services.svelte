<script lang="ts">
  import { t } from '$lib/i18n';
  import Reveal from './Reveal.svelte';
  import { Bot, Server, LayoutTemplate, Workflow, Send, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-svelte';

  let { variant = 'full', showHeader = true }: { variant?: 'full' | 'teaser'; showHeader?: boolean } =
    $props();

  const ENDPOINT = 'https://s-uah-miner-telemetry.ishawyha.workers.dev';

  const cards = [
    { key: 'bots', icon: Bot, chip: 'bg-[var(--color-sky-bg)] text-[var(--color-sky)]' },
    { key: 'backend', icon: Server, chip: 'bg-[var(--color-emerald-bg)] text-[var(--color-emerald)]' },
    { key: 'web', icon: LayoutTemplate, chip: 'bg-[var(--color-indigo-bg)] text-[var(--color-accent-500)]' },
    { key: 'automation', icon: Workflow, chip: 'bg-[var(--color-gold-bg)] text-[var(--color-gold)]' }
  ] as const;

  type Status = 'idle' | 'sending' | 'success' | 'error';

  let name = $state('');
  let contact = $state('');
  let service = $state('');
  let budget = $state('');
  let message = $state('');
  let company = $state('');
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
          type: 'order', name: name.trim(), contact: contact.trim(),
          service: service || '—', budget: budget.trim(), message: message.trim(), company
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
    'w-full rounded-xl border bg-[var(--color-card)] px-4 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-400)]/30';
  const fieldOk = 'border-[var(--color-line)] focus:border-[var(--color-accent-400)]';
  const fieldErr = 'border-rose-400 focus:border-rose-400';
</script>

<section id="services" class="scroll-mt-nav relative px-6 py-16">
  <div class="mx-auto max-w-6xl">
    {#if showHeader}
      <Reveal>
        <div class="mb-8">
          <span class="kicker">// services</span>
          <h2 class="display mt-3 text-4xl text-[var(--color-fg)] sm:text-5xl">{$t.services.title}</h2>
          <p class="mt-3 max-w-2xl text-base text-[var(--color-muted)]">{$t.services.subtitle}</p>
        </div>
      </Reveal>
    {/if}

    <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each cards as card, i}
        {@const item = $t.services.list[card.key]}
        <Reveal delay={i * 70}>
          <div class="card card-hover flex h-full flex-col p-6">
            <span class="grid h-11 w-11 place-items-center rounded-xl {card.chip}"><card.icon class="h-5 w-5" /></span>
            <h3 class="mt-4 text-lg font-bold text-[var(--color-fg)]">{item.title}</h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-body)]">{item.description}</p>
            <ul class="mt-4 flex flex-wrap gap-1.5">
              {#each item.tags as tag}<li class="tag">{tag}</li>{/each}
            </ul>
          </div>
        </Reveal>
      {/each}
    </div>

    {#if variant === 'teaser'}
      <Reveal>
        <div class="flex justify-center">
          <a href="/services" class="btn-primary group">
            {$t.services.teaserCta}
            <ArrowRight class="h-4 w-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    {:else}
    <Reveal>
      <div class="card p-8 sm:p-10">
        {#if status === 'success'}
          <div class="flex flex-col items-center py-8 text-center">
            <span class="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check class="h-7 w-7" /></span>
            <h3 class="mt-5 text-2xl font-bold text-[var(--color-fg)]">{$t.services.form.successTitle}</h3>
            <p class="mt-2 max-w-md text-sm text-[var(--color-body)]">{$t.services.form.successBody}</p>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onclick={reset} class="btn-secondary">{$t.services.form.again}</button>
              <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" class="btn-primary"><Send class="h-4 w-4" />{$t.services.form.altTelegram}</a>
            </div>
          </div>
        {:else}
          <div class="mb-6">
            <h3 class="text-2xl font-bold text-[var(--color-fg)]">{$t.services.form.title}</h3>
            <p class="mt-1.5 text-sm text-[var(--color-muted)]">{$t.services.form.subtitle}</p>
          </div>

          <form onsubmit={submit} novalidate class="grid gap-4 sm:grid-cols-2">
            <div class="absolute top-0 left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>Company<input bind:value={company} type="text" tabindex="-1" autocomplete="off" /></label>
            </div>

            <div>
              <label for="svc-name" class="mb-1.5 block text-xs font-semibold text-[var(--color-fg)]">{$t.services.form.name}</label>
              <input id="svc-name" bind:value={name} type="text" placeholder={$t.services.form.namePlaceholder} class="{fieldBase} {touched && !nameValid ? fieldErr : fieldOk}" />
            </div>
            <div>
              <label for="svc-contact" class="mb-1.5 block text-xs font-semibold text-[var(--color-fg)]">{$t.services.form.contact}</label>
              <input id="svc-contact" bind:value={contact} type="text" placeholder={$t.services.form.contactPlaceholder} class="{fieldBase} {touched && !contactValid ? fieldErr : fieldOk}" />
            </div>
            <div>
              <label for="svc-type" class="mb-1.5 block text-xs font-semibold text-[var(--color-fg)]">{$t.services.form.service}</label>
              <select id="svc-type" bind:value={service} class="{fieldBase} {fieldOk} appearance-none">
                <option value="" disabled selected>{$t.services.form.servicePlaceholder}</option>
                {#each serviceOptions as opt}<option value={opt}>{opt}</option>{/each}
              </select>
            </div>
            <div>
              <label for="svc-budget" class="mb-1.5 block text-xs font-semibold text-[var(--color-fg)]">{$t.services.form.budget}</label>
              <input id="svc-budget" bind:value={budget} type="text" placeholder={$t.services.form.budgetPlaceholder} class="{fieldBase} {fieldOk}" />
            </div>
            <div class="sm:col-span-2">
              <label for="svc-msg" class="mb-1.5 block text-xs font-semibold text-[var(--color-fg)]">{$t.services.form.message}</label>
              <textarea id="svc-msg" bind:value={message} rows="4" placeholder={$t.services.form.messagePlaceholder} class="{fieldBase} {touched && !messageValid ? fieldErr : fieldOk} resize-y"></textarea>
            </div>

            {#if status === 'error'}
              <div class="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 sm:col-span-2">
                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <div>
                  <div class="font-semibold">{$t.services.form.errorTitle}</div>
                  <div class="text-rose-700">{$t.services.form.errorBody} <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" class="underline hover:text-rose-900">@NeShawyha</a></div>
                </div>
              </div>
            {/if}

            <div class="flex flex-wrap items-center gap-3 sm:col-span-2">
              <button type="submit" disabled={status === 'sending'} class="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                {#if status === 'sending'}<Loader2 class="h-4 w-4 animate-spin" />{$t.services.form.sending}
                {:else}<Send class="h-4 w-4" />{$t.services.form.submit}{/if}
              </button>
              <a href="https://t.me/NeShawyha" target="_blank" rel="noopener noreferrer" class="btn-secondary"><Send class="h-4 w-4" />{$t.services.form.altTelegram}</a>
            </div>
          </form>
        {/if}
      </div>
    </Reveal>
    {/if}
  </div>
</section>
