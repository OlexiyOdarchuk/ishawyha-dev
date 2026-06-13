<script lang="ts">
  import { page } from '$app/stores';
  import { t } from '$lib/i18n';
  import Seo from '$lib/components/Seo.svelte';
  import { onMount } from 'svelte';

  const status = $derived($page.status);
  const is404 = $derived(status === 404);

  const title = $derived(is404 ? $t.errorPage.title404 : $t.errorPage.titleGeneric);
  const description = $derived(is404 ? $t.errorPage.desc404 : $t.errorPage.descGeneric);

  let mouseX = $state(0);
  let mouseY = $state(0);
  let containerRef: HTMLElement;
  let textRef: HTMLElement;

  let glitchActive = $state(false);

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef) return;
      const rect = containerRef.getBoundingClientRect();
      // Calculate mouse position relative to the center of the container
      mouseX = (e.clientX - rect.left - rect.width / 2) / 20;
      mouseY = (e.clientY - rect.top - rect.height / 2) / 20;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Random glitch intervals
    const triggerGlitch = () => {
      glitchActive = true;
      setTimeout(() => {
        glitchActive = false;
        setTimeout(triggerGlitch, Math.random() * 5000 + 2000);
      }, Math.random() * 200 + 50);
    };
    
    const timeout = setTimeout(triggerGlitch, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  });

  // Fun terminal-like messages
  let terminalLogs = $state([
    "> INITIALIZING SEARCH PROTOCOL...",
    "> SCANNING DIRECTORIES...",
  ]);

  onMount(() => {
    if (!is404) return;
    const path = $page.url.pathname;
    const sequences = [
      `> TARGET PATH: ${path}`,
      "> QUERYING DATABASE...",
      "> ERR: FRAGMENT NOT FOUND",
      "> TRACING LOST PACKETS...",
      "> PACKETS LOST IN THE VOID.",
      "> STATUS: 404. ABORTING."
    ];
    
    let i = 0;
    const addLog = () => {
      if (i < sequences.length) {
        terminalLogs = [...terminalLogs, sequences[i]];
        i++;
        setTimeout(addLog, Math.random() * 400 + 200);
      }
    };
    setTimeout(addLog, 600);
  });
</script>

<Seo {title} {description} path="/error" />

<section 
  bind:this={containerRef}
  class="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden"
>
  <!-- Interactive background grid that moves with mouse -->
  <div 
    class="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] transition-transform duration-75"
    style="transform: translate({mouseX * -1}px, {mouseY * -1}px); background-image: radial-gradient(var(--color-fg) 1px, transparent 1px); background-size: 32px 32px;"
  ></div>

  <div class="relative z-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
    
    <!-- Left: Glitch Art & Visuals -->
    <div class="flex justify-center md:justify-end relative perspective-1000">
      <div 
        bind:this={textRef}
        class="relative font-mono font-black select-none transition-transform duration-75"
        style="font-size: clamp(6rem, 15vw, 12rem); line-height: 1; transform: rotateX({mouseY}deg) rotateY({mouseX}deg);"
      >
        <span class="relative z-10 text-[var(--color-fg)] mix-blend-difference drop-shadow-2xl">{status}</span>
        
        {#if glitchActive}
          <span class="absolute top-0 left-[2px] text-[var(--color-rose)] z-0 opacity-70 animate-pulse" style="clip-path: inset({Math.random() * 100}% 0 {Math.random() * 100}% 0);">{status}</span>
          <span class="absolute top-0 left-[-2px] text-[var(--color-sky)] z-0 opacity-70 animate-pulse" style="clip-path: inset({Math.random() * 100}% 0 {Math.random() * 100}% 0);">{status}</span>
        {/if}

        <div class="absolute -inset-8 bg-gradient-to-r from-[var(--color-accent-400)] to-[var(--color-rose)] blur-3xl opacity-20 -z-10 rounded-full animate-pulse-soft"></div>
      </div>
    </div>

    <!-- Right: Terminal & Context -->
    <div class="flex flex-col gap-6 w-full max-w-md mx-auto md:mx-0">
      
      <div class="card p-6 border-l-4 border-l-[var(--color-accent-400)] relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
        </div>
        
        <h2 class="text-3xl font-display font-bold mb-2">
          {title}
        </h2>
        <p class="text-[var(--color-muted)] font-medium leading-relaxed mb-4">
          {description}
        </p>
        
        {#if !is404 && $page.error?.message}
          <div class="p-3 bg-[var(--color-rose-bg)] text-[var(--color-rose)] rounded text-sm font-mono break-all border border-[var(--color-rose-line)]">
            ERR_MSG: {$page.error.message}
          </div>
        {/if}

        <div class="flex gap-4 mt-6 relative z-10">
          <a href="/" class="btn-primary w-full justify-center">
            ← {$t.errorPage.home}
          </a>
        </div>
      </div>

      <!-- Fake Terminal Window -->
      {#if is404}
        <div class="card bg-black dark:bg-[#0b1120] border-[var(--color-line)] p-4 rounded-xl shadow-inner overflow-hidden font-mono text-xs sm:text-sm h-40 flex flex-col justify-end">
          <div class="flex flex-col gap-1 mt-2 text-[var(--color-emerald)] opacity-90">
            {#each terminalLogs as log}
              <div class="typing-line">{log}</div>
            {/each}
            <div class="animate-pulse w-2 h-4 bg-[var(--color-emerald)] mt-1"></div>
          </div>
        </div>
      {/if}
      
    </div>
  </div>
</section>

<style>
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .typing-line {
    overflow: hidden;
    white-space: nowrap;
    animation: typing 0.5s steps(30, end);
  }

  @keyframes typing {
    from { max-width: 0 }
    to { max-width: 100% }
  }
</style>
