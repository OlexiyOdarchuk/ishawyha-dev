<script lang="ts">
  import { lang, setLang } from '$lib/i18n';
</script>

<div
  class="relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-medium backdrop-blur"
  role="group"
  aria-label="Language switcher"
>
  <button
    type="button"
    class="relative z-10 rounded-full px-3 py-1 transition-colors {$lang === 'ua' ? 'text-white' : 'text-[var(--color-muted)] hover:text-white'}"
    aria-pressed={$lang === 'ua'}
    onclick={() => setLang('ua')}
  >
    UA
  </button>
  <button
    type="button"
    class="relative z-10 rounded-full px-3 py-1 transition-colors {$lang === 'en' ? 'text-white' : 'text-[var(--color-muted)] hover:text-white'}"
    aria-pressed={$lang === 'en'}
    onclick={() => setLang('en')}
  >
    EN
  </button>
  <span
    class="pointer-events-none absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-violet-500/80 to-pink-500/80 transition-transform duration-300"
    style="transform: translateX({$lang === 'ua' ? '0%' : '100%'})"
  ></span>
</div>
