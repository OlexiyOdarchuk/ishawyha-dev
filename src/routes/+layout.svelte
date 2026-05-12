<script lang="ts">
  import '../app.css';
  import { t, lang } from '$lib/i18n';
  import Background from '$lib/components/Background.svelte';
  import Header from '$lib/components/Header.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import Konami from '$lib/components/Konami.svelte';

  let { children } = $props();

  const ogLocale = $derived($lang === 'ua' ? 'uk_UA' : 'en_US');
  const ogLocaleAlternate = $derived($lang === 'ua' ? 'en_US' : 'uk_UA');
</script>

<svelte:head>
  <title>{$t.meta.title}</title>
  <meta name="description" content={$t.meta.description} />
  <meta property="og:title" content={$t.meta.title} />
  <meta property="og:description" content={$t.meta.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ishawyha.dev/" />
  <meta property="og:image" content="https://ishawyha.dev/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlternate} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={$t.meta.title} />
  <meta name="twitter:description" content={$t.meta.description} />
  <meta name="twitter:image" content="https://ishawyha.dev/og.png" />
  <link rel="canonical" href="https://ishawyha.dev/" />
  {@html '<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>'}
</svelte:head>

<div id="top" aria-hidden="true"></div>
<Background />
<Header />

<main class="relative">
  {@render children?.()}
</main>

<!-- Global UI overlays: Cmd+K palette and Konami easter egg -->
<CommandPalette />
<Konami />
