<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Plus, Minus, Maximize2, Minimize2, RefreshCcw, Move } from 'lucide-svelte';

  type Props = { svg: string };
  let { svg }: Props = $props();

  let viewerEl: HTMLDivElement | null = $state(null);
  let canvasEl: HTMLDivElement | null = $state(null);

  let scale = $state(1);
  let tx = $state(0);
  let ty = $state(0);
  let isFullscreen = $state(false);
  let interacted = $state(false);

  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const MIN_SCALE = 0.15;
  const MAX_SCALE = 12;

  function clamp(s: number) {
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
  }

  function ensureSvgSize(): { w: number; h: number } | null {
    if (!canvasEl) return null;
    const svgEl = canvasEl.querySelector('svg');
    if (!svgEl) return null;
    let w = 0;
    let h = 0;
    const vb = svgEl.getAttribute('viewBox');
    if (vb) {
      const parts = vb.split(/[\s,]+/).map(Number);
      if (Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
        w = parts[2];
        h = parts[3];
      }
    }
    if (!w || !h) {
      const rect = svgEl.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
    }
    if (!w || !h) return null;
    // Outer SVG without width/height defaults to 300×150 in CSS — kill that
    // by pinning explicit dimensions so transform: scale(...) is meaningful.
    svgEl.setAttribute('width', String(w));
    svgEl.setAttribute('height', String(h));
    return { w, h };
  }

  function fit() {
    if (!viewerEl) return false;
    const size = ensureSvgSize();
    if (!size) return false;
    const cw = viewerEl.clientWidth;
    const ch = viewerEl.clientHeight;
    if (cw === 0 || ch === 0) return false;
    const ratio = Math.min(cw / size.w, ch / size.h) * 0.92;
    scale = clamp(ratio);
    tx = (cw - size.w * scale) / 2;
    ty = (ch - size.h * scale) / 2;
    interacted = false;
    return true;
  }

  async function refit() {
    await tick();
    // SVG can take a frame or two to lay out (D2 uses embedded styles + nested svg).
    let attempts = 0;
    const tryFit = () => {
      if (fit()) return;
      if (++attempts < 8) requestAnimationFrame(tryFit);
    };
    requestAnimationFrame(tryFit);
  }

  $effect(() => {
    // Re-fit whenever the SVG content changes.
    svg;
    refit();
  });

  function zoomIn() {
    interacted = true;
    scale = clamp(scale * 1.2);
  }
  function zoomOut() {
    interacted = true;
    scale = clamp(scale / 1.2);
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0 || !viewerEl) return;
    // Ignore drags that start inside the toolbar / hint — otherwise pointer
    // capture redirects pointerup to the viewer and the button never gets a click.
    const target = e.target as Element | null;
    if (target?.closest('[data-flow-ui]')) return;
    dragging = true;
    interacted = true;
    lastX = e.clientX;
    lastY = e.clientY;
    viewerEl.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    tx += e.clientX - lastX;
    ty += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
  }
  function onPointerUp(e: PointerEvent) {
    dragging = false;
    if (viewerEl?.hasPointerCapture(e.pointerId)) viewerEl.releasePointerCapture(e.pointerId);
  }

  async function toggleFullscreen() {
    if (!viewerEl) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerEl.requestFullscreen();
      }
    } catch {
      // ignore — fullscreen may be blocked
    }
  }

  onMount(() => {
    if (!viewerEl) return;

    // Auto-refit when the container itself resizes (parent flex changes,
    // entering/exiting fullscreen, window resize, etc.).
    const ro = new ResizeObserver(() => {
      if (!interacted) refit();
    });
    ro.observe(viewerEl);

    const wheelHandler = (e: WheelEvent) => {
      if (!viewerEl) return;
      e.preventDefault();
      interacted = true;
      const delta = -Math.sign(e.deltaY) * 0.12;
      const next = clamp(scale * (1 + delta));
      const rect = viewerEl.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const ratio = next / scale;
      tx = cx - (cx - tx) * ratio;
      ty = cy - (cy - ty) * ratio;
      scale = next;
    };
    viewerEl.addEventListener('wheel', wheelHandler, { passive: false });

    const fsHandler = () => {
      isFullscreen = document.fullscreenElement === viewerEl;
      refit();
    };
    document.addEventListener('fullscreenchange', fsHandler);

    const keyHandler = (e: KeyboardEvent) => {
      const inFs = document.fullscreenElement === viewerEl;
      const focused = viewerEl && (viewerEl === document.activeElement || viewerEl.contains(document.activeElement));
      if (!inFs && !focused) return;
      const step = e.shiftKey ? 60 : 20;
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        fit();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        interacted = true;
        tx += step;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        interacted = true;
        tx -= step;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        interacted = true;
        ty += step;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        interacted = true;
        ty -= step;
      }
    };
    document.addEventListener('keydown', keyHandler);

    return () => {
      ro.disconnect();
      viewerEl?.removeEventListener('wheel', wheelHandler);
      document.removeEventListener('fullscreenchange', fsHandler);
      document.removeEventListener('keydown', keyHandler);
    };
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={viewerEl}
  class="flow-viewer"
  tabindex="0"
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointercancel={onPointerUp}
  ondblclick={fit}
  role="application"
  aria-label="Flowchart viewer — wheel to zoom, drag to pan, arrows to pan, +/− to zoom, 0 to fit"
>
  <div
    bind:this={canvasEl}
    class="flow-canvas"
    style="transform: translate({tx}px, {ty}px) scale({scale}); transform-origin: 0 0"
  >
    {@html svg}
  </div>

  <div class="toolbar" data-flow-ui>
    <button type="button" onclick={zoomOut} title="Zoom out (−)" aria-label="Zoom out">
      <Minus class="h-3.5 w-3.5" />
    </button>
    <span class="zoom-pct" aria-live="polite">{Math.round(scale * 100)}%</span>
    <button type="button" onclick={zoomIn} title="Zoom in (+)" aria-label="Zoom in">
      <Plus class="h-3.5 w-3.5" />
    </button>
    <span class="sep" aria-hidden="true"></span>
    <button type="button" onclick={fit} title="Fit (0)" aria-label="Fit to screen">
      <RefreshCcw class="h-3.5 w-3.5" />
    </button>
    <button type="button" onclick={toggleFullscreen} title="Fullscreen" aria-label="Toggle fullscreen">
      {#if isFullscreen}
        <Minimize2 class="h-3.5 w-3.5" />
      {:else}
        <Maximize2 class="h-3.5 w-3.5" />
      {/if}
    </button>
  </div>

  {#if !interacted}
    <div class="hint" data-flow-ui aria-hidden="true">
      <Move class="h-3.5 w-3.5" />
      <span>колесо — zoom · перетягни — pan · 2× клік — fit</span>
    </div>
  {/if}
</div>

<style>
  .flow-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f8fafc;
    background-image:
      linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px);
    background-size: 24px 24px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }
  .flow-viewer:active {
    cursor: grabbing;
  }
  .flow-viewer:fullscreen {
    background: #f8fafc;
  }
  .flow-canvas {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
  }
  :global(.flow-canvas svg) {
    display: block;
    background: transparent;
  }
  :global(.flow-canvas svg text) {
    fill: #0f172a;
  }

  .toolbar {
    position: absolute;
    top: 12px;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 6px;
    border-radius: 999px;
    background: rgba(10, 9, 22, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: #fff;
    font: 500 11px 'JetBrains Mono', ui-monospace, monospace;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
    pointer-events: auto;
  }
  .toolbar button {
    display: grid;
    place-items: center;
    height: 26px;
    width: 26px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.85);
    transition: background 0.15s, color 0.15s;
  }
  .toolbar button:hover {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }
  .toolbar .zoom-pct {
    min-width: 44px;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    user-select: none;
  }
  .toolbar .sep {
    display: inline-block;
    width: 1px;
    height: 16px;
    margin: 0 2px;
    background: rgba(255, 255, 255, 0.12);
  }

  .hint {
    position: absolute;
    left: 12px;
    bottom: 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: rgba(10, 9, 22, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.78);
    font: 500 11px 'JetBrains Mono', ui-monospace, monospace;
    pointer-events: none;
  }
</style>
