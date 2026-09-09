import { localPersistence } from './localPersistence';

const CACHE_TTL_MS = 10 * 60 * 1000;

export interface CacheEntry<T = any> {
  cache_key: string;
  entity: string;
  user_id: string;
  data: T[];
  cached_at: number;
}

export interface SyncMeta {
  key: string;
  last_sync_at: string;
  synced_entities: string[];
}

class DataCache {
  private async getDb(): Promise<IDBDatabase> {
    return (localPersistence as any).init();
  }

  async get<T = any>(entity: string, userId: string): Promise<T[] | null> {
    try {
      const db = await this.getDb();
      const key = `${entity}:${userId}`;
      return new Promise((resolve) => {
        const tx = db.transaction('cache_v1', 'readonly');
        const store = tx.objectStore('cache_v1');
        const req = store.get(key);
        req.onsuccess = () => {
          const entry = req.result as CacheEntry<T> | undefined;
          if (!entry) return resolve(null);
          const age = Date.now() - entry.cached_at;
          if (age > CACHE_TTL_MS) return resolve(null);
          resolve(entry.data);
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async set<T = any>(entity: string, userId: string, data: T[]): Promise<void> {
    try {
      const db = await this.getDb();
      const entry: CacheEntry<T> = {
        cache_key: `${entity}:${userId}`,
        entity,
        user_id: userId,
        data,
        cached_at: Date.now(),
      };
      return new Promise((resolve) => {
        const tx = db.transaction('cache_v1', 'readwrite');
        const store = tx.objectStore('cache_v1');
        store.put(entry);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {}
  }

  async merge<T extends { id?: any; uid?: any; updated_at?: string; updatedAt?: string }>(
    entity: string,
    userId: string,
    delta: T[],
  ): Promise<T[]> {
    const existing = (await this.get<T>(entity, userId)) ?? [];
    const map = new Map<string, T>();
    for (const item of existing) {
      const k = String(item.uid ?? item.id);
      map.set(k, item);
    }
    for (const item of delta) {
      const k = String(item.uid ?? item.id);
      map.set(k, item);
    }
    const merged = Array.from(map.values());
    await this.set(entity, userId, merged);
    return merged;
  }

  async invalidate(entity: string, userId: string): Promise<void> {
    try {
      const db = await this.getDb();
      const key = `${entity}:${userId}`;
      return new Promise((resolve) => {
        const tx = db.transaction('cache_v1', 'readwrite');
        tx.objectStore('cache_v1').delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {}
  }

  async clearAll(userId: string): Promise<void> {
    for (const entity of ['projects', 'diagrams', 'notes', 'flowcharts', 'drawings']) {
      await this.invalidate(entity, userId);
    }
    await this.clearSyncMeta(userId);
  }

  async getSyncMeta(userId: string): Promise<SyncMeta | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('sync_meta', 'readonly');
        const req = tx.objectStore('sync_meta').get(`sync:${userId}`);
        req.onsuccess = () => resolve((req.result as SyncMeta) ?? null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async setSyncMeta(userId: string, meta: Omit<SyncMeta, 'key'>): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('sync_meta', 'readwrite');
        tx.objectStore('sync_meta').put({ key: `sync:${userId}`, ...meta });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {}
  }

  async clearSyncMeta(userId: string): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const tx = db.transaction('sync_meta', 'readwrite');
        tx.objectStore('sync_meta').delete(`sync:${userId}`);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {}
  }
}

export const dataCache = new DataCache();
