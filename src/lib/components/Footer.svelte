<script lang="ts">
  import { t } from '$lib/i18n';
  import Logo from './Logo.svelte';

  const year = new Date().getFullYear();
  const buildHash = __BUILD_HASH__;
  const buildDate = __BUILD_DATE__;
</script>

<footer class="relative px-6 pt-12 pb-10">
  <div class="mx-auto max-w-6xl">
    <div class="flex flex-col items-start justify-between gap-4 border-t border-[var(--color-line)] pt-8 sm:flex-row sm:items-center">
      <div class="flex items-center gap-2.5">
        <Logo size={28} />
        <p class="text-sm text-[var(--color-muted)]"><span class="font-bold text-[var(--color-fg)]">ishawyha.dev</span> · © {year} {$t.footer.rights}</p>
      </div>
      <p class="font-mono text-xs text-[var(--color-muted)]">{$t.footer.stamp.rev} {buildHash} · {buildDate}</p>
    </div>
  </div>
</footer>
