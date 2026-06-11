<script lang="ts">
  import { lang, setLang } from '$lib/i18n';
</script>

<div
  class="relative inline-flex items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] p-0.5 text-xs font-medium"
  role="group"
  aria-label="Language switcher"
>
  <button
    type="button"
    class="relative z-10 rounded-full px-3 py-1 font-mono transition-colors {$lang === 'ua' ? 'text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'}"
    aria-pressed={$lang === 'ua'}
    onclick={() => setLang('ua')}
  >
    UA
  </button>
  <button
    type="button"
    class="relative z-10 rounded-full px-3 py-1 font-mono transition-colors {$lang === 'en' ? 'text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-fg)]'}"
    aria-pressed={$lang === 'en'}
    onclick={() => setLang('en')}
  >
    EN
  </button>
  <span
    class="pointer-events-none absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-[var(--color-accent-400)] transition-transform duration-300"
    style="transform: translateX({$lang === 'ua' ? '0%' : '100%'})"
  ></span>
</div>
