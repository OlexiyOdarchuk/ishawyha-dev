<script lang="ts">
  import { t } from '$lib/i18n';
  import { page } from '$app/state';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import Logo from './Logo.svelte';
  import { theme, toggleTheme } from '$lib/theme';
  import { onMount } from 'svelte';
  import { Menu, X, Coffee, Sun, Moon } from 'lucide-svelte';

  let scrolled = $state(false);
  let mobileOpen = $state(false);

  const links = $derived([
    { href: '/', label: $t.nav.home },
    { href: '/rombik', label: $t.nav.rombik },
    { href: '/projects', label: $t.nav.projects },
    { href: '/services', label: $t.nav.services },
    { href: '/lab', label: $t.nav.lab },
    { href: '/about', label: $t.nav.about }
  ]);

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

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<header
  class="fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 {scrolled
    ? 'border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur-md'
    : 'border-b border-transparent'}"
>
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
    <a href="/" class="group flex items-center gap-2.5" onclick={closeMobile}>
      <Logo size={32} />
      <span class="hidden text-sm font-extrabold tracking-tight sm:inline"><span class="text-[var(--color-fg)]">ishawyha</span><span class="text-[var(--color-accent-500)]">.</span><span class="text-[var(--color-muted)]">dev</span></span>
    </a>

    <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
      {#each links as link}
        <a
          href={link.href}
          aria-current={isActive(link.href) ? 'page' : undefined}
          class="rounded-full px-3.5 py-1.5 text-sm font-medium transition {isActive(link.href)
            ? 'bg-[var(--color-accent-400)]/12 text-[var(--color-accent-500)]'
            : 'text-[var(--color-muted)] hover:bg-[var(--color-bg-soft)] hover:text-[var(--color-fg)]'}"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-2.5">
      <a
        href="https://send.monobank.ua/jar/23E3WYNesG"
        target="_blank"
        rel="noopener noreferrer"
        onclick={() => typeof window !== 'undefined' && window.gtag?.('event', 'click_donate_header_desktop')}
        class="hidden items-center gap-1.5 rounded-full border border-[var(--color-gold-line)] bg-[var(--color-gold-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--color-gold)] transition hover:brightness-95 sm:flex"
      >
        <Coffee class="h-3.5 w-3.5" />
        {$t.nav.donate}
      </a>
      <button
        type="button"
        onclick={toggleTheme}
        class="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-fg)] transition hover:border-[var(--color-accent-400)] hover:text-[var(--color-accent-500)]"
        aria-label="Toggle theme"
        title="Світла / темна тема"
      >
        {#if $theme === 'dark'}<Sun class="h-4 w-4" />{:else}<Moon class="h-4 w-4" />{/if}
      </button>
      <LanguageSwitcher />
      <button
        type="button"
        class="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-fg)] transition hover:border-[var(--color-accent-400)] md:hidden"
        aria-label={mobileOpen ? $t.nav.closeMenu : $t.nav.openMenu}
        aria-expanded={mobileOpen}
        aria-controls="mobile-nav"
        onclick={() => (mobileOpen = !mobileOpen)}
      >
        {#if mobileOpen}<X class="h-4 w-4" />{:else}<Menu class="h-4 w-4" />{/if}
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div id="mobile-nav" class="md:hidden">
      <button
        type="button"
        class="fixed inset-0 top-[60px] z-30 bg-[var(--color-fg)]/15"
        aria-label={$t.nav.closeMenu}
        onclick={closeMobile}
      ></button>
      <nav class="relative z-40 border-t border-[var(--color-line)] bg-[var(--color-card)] px-6 pt-3 pb-5" aria-label="Mobile">
        <ul class="flex flex-col gap-1">
          {#each links as link}
            <li>
              <a
                href={link.href}
                onclick={closeMobile}
                aria-current={isActive(link.href) ? 'page' : undefined}
                class="block rounded-xl px-4 py-3 text-base font-medium transition {isActive(link.href)
                  ? 'bg-[var(--color-accent-400)]/12 text-[var(--color-accent-500)]'
                  : 'text-[var(--color-body)] hover:bg-[var(--color-bg-soft)]'}"
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
              class="mt-2 flex items-center gap-2 rounded-xl border border-[var(--color-gold-line)] bg-[var(--color-gold-bg)] px-4 py-3 text-base font-medium text-[var(--color-gold)]"
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
