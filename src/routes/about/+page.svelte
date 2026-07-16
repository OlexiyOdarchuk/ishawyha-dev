<script lang="ts">
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  import About from '$lib/components/About.svelte';
  import Achievements from '$lib/components/Achievements.svelte';
  import Experience from '$lib/components/Experience.svelte';
  import Stack from '$lib/components/Stack.svelte';
  import Education from '$lib/components/Education.svelte';
  import Contact from '$lib/components/Contact.svelte';
</script>

<Seo title={$t.pages.about.metaTitle} description={$t.pages.about.metaDesc} path="/about" />

<PageHero
  kicker={$t.pages.about.kicker}
  title={$t.pages.about.title}
  subtitle={$t.pages.about.subtitle}
/>

<About showHeader={false} />

<Experience />

<Achievements />

<Stack />

<Education />

<Contact />
