<script lang="ts">
  import { t } from '$lib/i18n';

  const year = new Date().getFullYear();
</script>

<footer class="relative px-6 pt-12 pb-10">
  <div class="mx-auto max-w-6xl">
    <div class="flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
      <p class="font-mono text-xs text-[var(--color-muted)]">
        © {year} {$t.footer.rights}
      </p>
      <p class="font-mono text-xs text-[var(--color-muted)]">
        {$t.footer.made}
        <span class="ml-2 inline-block text-violet-300">·</span>
        <a
          href="https://github.com/OlexiyOdarchuk/piton"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-1 text-white/80 transition hover:text-violet-200"
        >
          built with Piton DNA
        </a>
      </p>
    </div>
  </div>
</footer>
