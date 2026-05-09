<script lang="ts">
  import '../app.css';
  import { t } from '$lib/i18n';
  import Background from '$lib/components/Background.svelte';
  import Header from '$lib/components/Header.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>{$t.meta.title}</title>
  <meta name="description" content={$t.meta.description} />
  <meta property="og:title" content={$t.meta.title} />
  <meta property="og:description" content={$t.meta.description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ishawyha.dev/" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div id="top" aria-hidden="true"></div>
<Background />
<Header />

<main class="relative">
  {@render children?.()}
</main>
