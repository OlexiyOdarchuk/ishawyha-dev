import { writable, derived, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import ua from './ua.json';
import en from './en.json';

export type Lang = 'ua' | 'en';
export type Translations = typeof ua;

const dictionaries: Record<Lang, Translations> = { ua, en: en as Translations };

const STORAGE_KEY = 'ishawyha:lang';

function initial(): Lang {
  if (!browser) return 'ua';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ua' || saved === 'en') return saved;
    const nav = navigator.language?.toLowerCase() ?? '';
    if (nav.startsWith('uk') || nav.startsWith('ru')) return 'ua';
    if (nav.startsWith('en')) return 'en';
  } catch {}
  return 'ua';
}

export const lang = writable<Lang>(initial());

if (browser) {
  lang.subscribe((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      document.documentElement.lang = value === 'ua' ? 'uk' : 'en';
    } catch {}
  });
}

export const t: Readable<Translations> = derived(lang, ($lang) => dictionaries[$lang]);

type DocWithVT = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => { finished: Promise<void> };
};

/**
 * Swap language inside a View Transition when the browser supports it —
 * gives a smooth crossfade across all localised text. Falls back to a
 * plain `lang.set` everywhere else.
 */
export function setLang(value: Lang) {
  if (!browser) {
    lang.set(value);
    return;
  }
  const doc = document as DocWithVT;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (doc.startViewTransition && !reduced) {
    doc.startViewTransition(() => {
      lang.set(value);
    });
  } else {
    lang.set(value);
  }
}

export function toggleLang() {
  lang.update((v) => (v === 'ua' ? 'en' : 'ua'));
}
