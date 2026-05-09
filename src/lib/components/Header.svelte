<script lang="ts">
  import { t } from '$lib/i18n';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { onMount } from 'svelte';

  let scrolled = $state(false);

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 16;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  const links = $derived([
    { id: 'about', label: $t.nav.about },
    { id: 'achievements', label: $t.nav.achievements },
    { id: 'projects', label: $t.nav.projects },
    { id: 'lab', label: $t.nav.lab },
    { id: 'contact', label: $t.nav.contact }
  ]);
</script>

<header
  class="sticky top-0 z-40 w-full transition-all duration-300 {scrolled ? 'border-b border-white/5 bg-[#08070f]/70 backdrop-blur-xl' : 'bg-transparent'}"
>
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="#top" class="group flex items-center gap-2 text-sm font-semibold tracking-tight">
      <span
        class="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-amber-400 font-mono text-[11px] text-black shadow-lg shadow-violet-500/30"
      >
        iO
      </span>
      <span class="hidden text-white/90 sm:inline">ishawyha<span class="text-[var(--color-muted)]">.dev</span></span>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
      {#each links as link}
        <a
          href="#{link.id}"
          class="rounded-full px-3 py-1.5 text-sm text-[var(--color-muted)] transition hover:bg-white/5 hover:text-white"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <LanguageSwitcher />
    </div>
  </div>
</header>
