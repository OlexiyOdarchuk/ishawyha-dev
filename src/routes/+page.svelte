<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Metrics from '$lib/components/Metrics.svelte';
  import LiveActivity from '$lib/components/LiveActivity.svelte';
  import About from '$lib/components/About.svelte';
  import Experience from '$lib/components/Experience.svelte';
  import Projects from '$lib/components/Projects.svelte';
  import Services from '$lib/components/Services.svelte';
  import Contact from '$lib/components/Contact.svelte';
</script>

<Seo title={$t.meta.title} description={$t.meta.description} path="/" />

<Hero />
<Metrics />
<LiveActivity />

<About />

<!-- Комерційний досвід — головний сигнал для рекрутера, одразу після About -->
<Experience />

<!-- Services teaser → /services (surfaced early: hire-me first) -->
<Services variant="teaser" />

<!-- Featured project teaser → /projects -->
<Projects variant="featured" />

<!-- Contact CTA -->
<Contact />
