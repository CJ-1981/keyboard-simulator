import { openDB, type IDBPDatabase } from 'idb';
import type { Design, DesignLibraryEntry } from '../store/types';
import { DB_NAME, DB_VERSION, STORE_DESIGNS, STORE_META } from '../store/types';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_DESIGNS)) {
          const store = db.createObjectStore(STORE_DESIGNS, { keyPath: 'id' });
          store.createIndex('byUpdatedAt', 'updatedAt');
          store.createIndex('byLayout', 'layout');
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META);
        }
      },
    });
  }
  return dbPromise;
}

export async function saveDesign(design: Design): Promise<void> {
  const db = await getDB();
  await db.put(STORE_DESIGNS, design);
}

export async function getDesign(id: string): Promise<Design | undefined> {
  const db = await getDB();
  return db.get(STORE_DESIGNS, id);
}

export async function deleteDesign(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_DESIGNS, id);
}

export async function listDesigns(): Promise<DesignLibraryEntry[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex(STORE_DESIGNS, 'byUpdatedAt');
  // Sort descending by updatedAt (newest first)
  return (all as Design[])
    .map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      layout: d.layout,
      updatedAt: d.updatedAt,
      createdAt: d.createdAt,
    }))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get(STORE_META, key);
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put(STORE_META, value, key);
}

// ─── localStorage fallback (used if IndexedDB is unavailable) ─────────────

const lsFallback = {
  load(): Design[] {
    try {
      const raw = localStorage.getItem('keyboard-lab:designs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  save(designs: Design[]) {
    try {
      localStorage.setItem('keyboard-lab:designs', JSON.stringify(designs));
    } catch (e) {
      console.warn('localStorage fallback failed:', e);
    }
  },
};

export async function isIndexedDBAvailable(): Promise<boolean> {
  try {
    await getDB();
    return true;
  } catch {
    return false;
  }
}
