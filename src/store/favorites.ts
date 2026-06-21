/**
 * Favorites storage for colorway presets.
 *
 * Uses localStorage (not IndexedDB) because the favorite IDs are a tiny set
 * of strings — under 1KB even with all 80 presets favorited. localStorage
 * is simpler and synchronous, which makes the UI feel snappy.
 */

const STORAGE_KEY = 'keyboard-lab:colorway-favorites';

let favorites: Set<string> = load();
const listeners = new Set<() => void>();

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr.filter((s) => typeof s === 'string'));
    return new Set();
  } catch {
    return new Set();
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  } catch (e) {
    console.warn('Failed to persist colorway favorites:', e);
  }
}

export function isFavorite(id: string): boolean {
  return favorites.has(id);
}

export function toggleFavorite(id: string): boolean {
  // Returns the new state (true = now favorited)
  if (favorites.has(id)) {
    favorites.delete(id);
    persist();
    notify();
    return false;
  } else {
    favorites.add(id);
    persist();
    notify();
    return true;
  }
}

export function getFavorites(): string[] {
  return [...favorites];
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn();
}
