<script lang="ts">
  import '../app.css';
  import Background from '$lib/components/Background.svelte';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import Konami from '$lib/components/Konami.svelte';

  let { children } = $props();
</script>

<svelte:head>
  {@html '<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>'}
</svelte:head>

<div id="top" aria-hidden="true"></div>
<Background />
<Header />

<main class="relative">
  {@render children?.()}
</main>

<Footer />

<!-- Global UI overlays: Cmd+K palette and Konami easter egg -->
<CommandPalette />
<Konami />
