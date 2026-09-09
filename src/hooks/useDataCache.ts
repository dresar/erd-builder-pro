import { useCallback, useRef } from 'react';
import { dataCache } from '../lib/dataCache';
import { apiFetch } from '../lib/api';

const SYNC_ENTITIES = ['projects', 'diagrams', 'notes', 'flowcharts', 'drawings'] as const;
type SyncEntity = typeof SYNC_ENTITIES[number];

interface DeltaSyncResult {
  projects?: any[];
  diagrams?: any[];
  notes?: any[];
  flowcharts?: any[];
  drawings?: any[];
  synced_at?: string;
}

interface UseDataCacheOptions {
  userId: string | null;
  isGuest: boolean;
}

export function useDataCache({ userId, isGuest }: UseDataCacheOptions) {
  const isSyncingRef = useRef(false);

  const loadFromCache = useCallback(async (entity: SyncEntity): Promise<any[] | null> => {
    if (!userId || isGuest) return null;
    return dataCache.get(entity, userId);
  }, [userId, isGuest]);

  const saveToCache = useCallback(async (entity: SyncEntity, data: any[]): Promise<void> => {
    if (!userId || isGuest) return;
    await dataCache.set(entity, userId, data);
  }, [userId, isGuest]);

  const runDeltaSync = useCallback(async (
    onData: (entity: SyncEntity, items: any[]) => void,
  ): Promise<void> => {
    if (!userId || isGuest || isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      const meta = await dataCache.getSyncMeta(userId);
      const sinceParam = meta?.last_sync_at
        ? `&since=${encodeURIComponent(meta.last_sync_at)}`
        : '';
      const entitiesParam = `entities=${SYNC_ENTITIES.join(',')}`;

      const res = await apiFetch(`/api/sync?${entitiesParam}${sinceParam}`);
      if (!res.ok) return;

      const json: DeltaSyncResult = await res.json();

      for (const entity of SYNC_ENTITIES) {
        const delta = json[entity];
        if (!delta || delta.length === 0) continue;
        const merged = await dataCache.merge(entity, userId, delta);
        onData(entity, merged);
      }

      if (json.synced_at) {
        await dataCache.setSyncMeta(userId, {
          last_sync_at: json.synced_at,
          synced_entities: SYNC_ENTITIES as unknown as string[],
        });
      }
    } catch {
    } finally {
      isSyncingRef.current = false;
    }
  }, [userId, isGuest]);

  const invalidateEntity = useCallback(async (entity: SyncEntity): Promise<void> => {
    if (!userId || isGuest) return;
    await dataCache.invalidate(entity, userId);
  }, [userId, isGuest]);

  const clearCache = useCallback(async (): Promise<void> => {
    if (!userId) return;
    await dataCache.clearAll(userId);
  }, [userId]);

  return {
    loadFromCache,
    saveToCache,
    runDeltaSync,
    invalidateEntity,
    clearCache,
  };
}
