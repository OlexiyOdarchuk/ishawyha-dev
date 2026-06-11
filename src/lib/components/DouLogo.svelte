<script lang="ts">
  // Значок DOU Day: жирна «D», від якої вправо розходяться хвилі (мовлення/
  // спільнота) — у стилі лого DOU. Колір береться з currentColor.
  let { size = 24 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 28 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  aria-hidden="true"
>
  <!-- D -->
  <path d="M4 3.5 H8.5 a8.5 8.5 0 0 1 0 17 H4 Z" fill="currentColor" stroke="none" />
  <!-- хвилі -->
  <path d="M15.5 8.5 a6 6 0 0 1 0 7" opacity="0.95" />
  <path d="M19 6 a10 10 0 0 1 0 12" opacity="0.7" />
  <path d="M22.5 3.5 a14 14 0 0 1 0 17" opacity="0.45" />
</svg>
