<script lang="ts">
  import { t } from '$lib/i18n';

  const year = new Date().getFullYear();
  // Injected by vite.config.ts at build time — git short hash + build date.
  const buildHash = __BUILD_HASH__;
  const buildDate = __BUILD_DATE__;
</script>

<footer class="relative px-6 pt-12 pb-10">
  <div class="mx-auto max-w-6xl">
    <div class="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
      <p class="font-mono text-xs text-[var(--color-muted)]">
        © {year} {$t.footer.rights}
      </p>
      <p class="flex flex-wrap items-center gap-x-2 font-mono text-xs text-[var(--color-muted)]">
        {$t.footer.made}
        <span class="text-violet-300">·</span>
        <span title="git short hash · build date">
          {buildHash} · {buildDate}
        </span>
      </p>
    </div>
  </div>
</footer>
