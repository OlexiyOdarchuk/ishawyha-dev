<script lang="ts">
  import { lang } from '$lib/i18n';

  // Per-page <head> meta. Each route renders one of these with its own
  // title/description/path so prerendered pages carry correct SEO + OG tags.
  let { title, description, path = '/' }: { title: string; description: string; path?: string } =
    $props();

  const url = $derived(`https://ishawyha.dev${path}`);
  const ogLocale = $derived($lang === 'ua' ? 'uk_UA' : 'en_US');
  const ogLocaleAlternate = $derived($lang === 'ua' ? 'en_US' : 'uk_UA');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:image" content="https://ishawyha.dev/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlternate} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content="https://ishawyha.dev/og.png" />
  <link rel="canonical" href={url} />
</svelte:head>
