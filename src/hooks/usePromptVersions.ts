import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export interface PromptVersion {
  id: number; uid: string; name: string; prompt_text?: string; system_prompt?: string;
  version_label: string; status: string; eval_result_json?: string; security_result_json?: string;
  created_by?: string; created_at: string; updated_at: string; prompt_preview?: string;
}

export function usePromptVersions() {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVersions = useCallback(async (params?: { projectId?: number; status?: string }) => {
    setIsLoading(true);
    try {
      const sp = new URLSearchParams();
      if (params?.projectId) sp.set('project_id', String(params.projectId));
      if (params?.status) sp.set('status', params.status);
      const res = await apiFetch('/api/prompt-versions' + (sp.toString() ? '?' + sp.toString() : ''));
      if (res.ok) setVersions(await res.json());
    } catch { } finally { setIsLoading(false); }
  }, []);

  const saveVersion = useCallback(async (params: {
    name?: string; promptText: string; systemPrompt?: string; projectId?: number;
    variablesJson?: any[]; modelsJson?: any[]; versionLabel?: string; status?: string;
  }) => {
    setIsSaving(true);
    try {
      const res = await apiFetch('/api/prompt-versions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to save version'); return null; }
      setVersions(prev => [data, ...prev]);
      toast.success('Version saved');
      return data;
    } catch { toast.error('Failed to save version'); return null; }
    finally { setIsSaving(false); }
  }, []);

  const promoteStatus = useCallback(async (uid: string, status: 'draft' | 'stable' | 'archived') => {
    try {
      await apiFetch(`/api/prompt-versions/${uid}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setVersions(prev => prev.map(v => v.uid === uid ? { ...v, status } : v));
      toast.success('Status updated to ' + status);
    } catch { toast.error('Failed to update status'); }
  }, []);

  const deleteVersion = useCallback(async (uid: string) => {
    try {
      await apiFetch(`/api/prompt-versions/${uid}`, { method: 'DELETE' });
      setVersions(prev => prev.filter(v => v.uid !== uid));
    } catch { toast.error('Failed to delete version'); }
  }, []);

  const compareVersions = useCallback(async (uid1: string, uid2: string) => {
    try {
      const res = await apiFetch(`/api/prompt-versions/compare/${uid1}/${uid2}`);
      if (!res.ok) { toast.error('Failed to compare versions'); return null; }
      return await res.json();
    } catch { toast.error('Compare failed'); return null; }
  }, []);

  return { versions, isLoading, isSaving, fetchVersions, saveVersion, promoteStatus, deleteVersion, compareVersions };
}