<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  import Services from '$lib/components/Services.svelte';
</script>

<Seo title={$t.pages.services.metaTitle} description={$t.pages.services.metaDesc} path="/services" />

<PageHero
  kicker={$t.pages.services.kicker}
  title={$t.pages.services.title}
  subtitle={$t.pages.services.subtitle}
/>

<Services variant="full" showHeader={false} />
