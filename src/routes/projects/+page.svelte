<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  import Projects from '$lib/components/Projects.svelte';
</script>

<Seo title={$t.pages.projects.metaTitle} description={$t.pages.projects.metaDesc} path="/projects" />

<PageHero
  kicker={$t.pages.projects.kicker}
  title={$t.pages.projects.title}
  subtitle={$t.pages.projects.subtitle}
/>

<Projects variant="full" showHeader={false} />
