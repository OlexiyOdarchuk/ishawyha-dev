<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import LiveActivity from '$lib/components/LiveActivity.svelte';
  import About from '$lib/components/About.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Services from '$lib/components/Services.svelte';
  import Contact from '$lib/components/Contact.svelte';
</script>

<Seo title={$t.meta.title} description={$t.meta.description} path="/" />

<Hero />
<LiveActivity />

<About />

<!-- Featured project teaser → /projects -->
<Projects variant="featured" />

<!-- Services teaser → /services -->
<Services variant="teaser" />

<!-- Contact CTA -->
<Contact />
