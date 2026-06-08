<script lang="ts">
  import { t } from '$lib/i18n';
  import { page } from '$app/state';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { onMount } from 'svelte';
  import { Menu, X, Coffee } from 'lucide-svelte';

  let scrolled = $state(false);
  let mobileOpen = $state(false);

  const links = $derived([
    { href: '/', label: $t.nav.home },
    { href: '/projects', label: $t.nav.projects },
    { href: '/services', label: $t.nav.services },
    { href: '/lab', label: $t.nav.lab },
    { href: '/about', label: $t.nav.about }
  ]);

  // Active when the path matches exactly, or is a sub-path (never treat '/'
  // as a prefix of everything).
  function isActive(href: string): boolean {
    const path = page.url.pathname;
    if (href === '/') return path === '/';
    return path === href || path.startsWith(href + '/');
  }

  function closeMobile() {
    mobileOpen = false;
  }

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 16;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) mobileOpen = false;
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
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
    <a href="/" class="group flex items-center gap-2 text-sm font-semibold tracking-tight" onclick={closeMobile}>
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
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="rounded-full px-3 py-1.5 text-sm transition {isActive(link.href)
            ? 'bg-white/10 text-white'
            : 'text-[var(--color-muted)] hover:bg-white/5 hover:text-white'}"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <a
        href="https://send.monobank.ua/jar/23E3WYNesG"
        target="_blank"
        rel="noopener noreferrer"
        onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_donate_header_desktop')}
        class="hidden items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 sm:flex"
      >
        <Coffee class="h-3.5 w-3.5" />
        {$t.nav.donate}
      </a>
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
                href={link.href}
                onclick={closeMobile}
                aria-current={isActive(link.href) ? 'page' : undefined}
                class="block rounded-xl px-4 py-3 text-base transition {isActive(link.href)
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'}"
              >
                {link.label}
              </a>
            </li>
          {/each}
          <li>
            <a
              href="https://send.monobank.ua/jar/23E3WYNesG"
              target="_blank"
              rel="noopener noreferrer"
              onclick={() => { typeof window !== 'undefined' && window.gtag?.('event', 'click_donate_header_mobile'); closeMobile(); }}
              class="mt-2 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-base font-medium text-rose-300 transition hover:bg-rose-500/20"
            >
              <Coffee class="h-5 w-5" />
              {$t.nav.donate}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  {/if}
</header>
