<script lang="ts">
  import { onMount } from 'svelte';

  type Props = {
    children?: import('svelte').Snippet;
    delay?: number;
    y?: number;
    once?: boolean;
    class?: string;
  };

  let {
    children,
    delay = 0,
    y = 16,
    once = true,
    class: className = ''
  }: Props = $props();

  let visible = $state(false);
  let el: HTMLDivElement | null = $state(null);

  onMount(() => {
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      visible = true;
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible = true;
            if (once) obs.disconnect();
          } else if (!once) {
            visible = false;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<div
  bind:this={el}
  class="reveal {visible ? 'is-visible' : ''} {className}"
  style="--reveal-delay: {delay}ms; --reveal-y: {y}px"
>
  {@render children?.()}
</div>

<style>
  .reveal {
    opacity: 0;
    transform: translateY(var(--reveal-y, 16px));
    transition:
      opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
    will-change: opacity, transform;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
