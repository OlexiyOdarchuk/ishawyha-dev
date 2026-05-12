<script lang="ts">
  import { t } from '$lib/i18n';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { onMount } from 'svelte';
  import { Menu, X } from 'lucide-svelte';

  let scrolled = $state(false);
  let mobileOpen = $state(false);
  let activeId = $state('');

  const links = $derived([
    { id: 'about', label: $t.nav.about },
    { id: 'achievements', label: $t.nav.achievements },
    { id: 'projects', label: $t.nav.projects },
    { id: 'lab', label: $t.nav.lab },
    { id: 'bench', label: $t.nav.bench },
    { id: 'contact', label: $t.nav.contact }
  ]);

  function closeMobile() {
    mobileOpen = false;
  }

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 16;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const ids = ['about', 'achievements', 'projects', 'lab', 'bench', 'stack', 'education', 'contact'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    let observer: IntersectionObserver | null = null;
    if (sections.length && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          // Pick the entry closest to the top among intersecting ones.
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) activeId = visible[0].target.id;
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      for (const s of sections) observer.observe(s);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) mobileOpen = false;
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      observer?.disconnect();
    };
  });

  // Lock body scroll while mobile drawer is open.
  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<!--
  Anchored to the viewport (fixed), not to the document — `sticky` plays poorly
  with the iOS address-bar dance and any future ancestor that creates a
  transform/filter stacking context. Fixed is the safe default for an always-on
  top nav.
-->
<header
  class="fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 {scrolled
    ? 'border-b border-white/5 bg-[#08070f]/70 backdrop-blur-xl'
    : 'bg-transparent'}"
>
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="#top" class="group flex items-center gap-2 text-sm font-semibold tracking-tight" onclick={closeMobile}>
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
          aria-current={activeId === link.id ? 'page' : undefined}
          class="rounded-full px-3 py-1.5 text-sm transition {activeId === link.id
            ? 'bg-white/10 text-white'
            : 'text-[var(--color-muted)] hover:bg-white/5 hover:text-white'}"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <LanguageSwitcher />
      <button
        type="button"
        class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:text-white md:hidden"
        aria-label={mobileOpen ? $t.nav.closeMenu : $t.nav.openMenu}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        onclick={() => (mobileOpen = !mobileOpen)}
      >
        {#if mobileOpen}
          <X class="h-4 w-4" />
        {:else}
          <Menu class="h-4 w-4" />
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile drawer -->
  {#if mobileOpen}
    <div
      id="mobile-nav"
      class="md:hidden"
    >
      <button
        type="button"
        class="fixed inset-0 top-[68px] z-30 bg-black/40 backdrop-blur-sm"
        aria-label={$t.nav.closeMenu}
        onclick={closeMobile}
      ></button>
      <nav
        class="relative z-40 border-t border-white/5 bg-[#08070f]/95 px-6 pb-6 pt-4 backdrop-blur-xl"
        aria-label="Mobile"
      >
        <ul class="flex flex-col gap-1">
          {#each links as link}
            <li>
              <a
                href="#{link.id}"
                onclick={closeMobile}
                aria-current={activeId === link.id ? 'page' : undefined}
                class="block rounded-xl px-4 py-3 text-base transition {activeId === link.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'}"
              >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</header>
