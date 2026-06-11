<script lang="ts">
  // Лого: термінальний промпт «>_» — бекенд / CLI. Білий моно-гліф на
  // індиговому заокругленому квадраті. Працює в обох темах.
  let { size = 32 }: { size?: number } = $props();
</script>

<span
  class="grid shrink-0 place-items-center rounded-xl bg-[var(--color-accent-400)] font-mono font-bold text-white shadow-sm"
  style="width:{size}px;height:{size}px;font-size:{Math.round(size * 0.42)}px;letter-spacing:-0.04em"
  aria-hidden="true"
>&gt;_</span>
