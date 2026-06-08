<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  import PitonLab from '$lib/components/PitonLab.svelte';
  import RombikLab from '$lib/components/RombikLab.svelte';
  import Bench from '$lib/components/Bench.svelte';
</script>

<Seo title={$t.pages.lab.metaTitle} description={$t.pages.lab.metaDesc} path="/lab" />

<PageHero kicker={$t.pages.lab.kicker} title={$t.pages.lab.title} subtitle={$t.pages.lab.subtitle} />

<PitonLab showHeader={false} />
<RombikLab />
<Bench />
