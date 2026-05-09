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

export function setLang(value: Lang) {
  lang.set(value);
}

export function toggleLang() {
  lang.update((v) => (v === 'ua' ? 'en' : 'ua'));
}
