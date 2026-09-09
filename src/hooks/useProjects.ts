import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Project } from '../types';
import { localPersistence } from '../lib/localPersistence';
import { apiFetch } from '../lib/api';

export function useProjects(isGuest: boolean = false) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [projectsTotal, setProjectsTotal] = useState(0);
  const [hasMoreProjects, setHasMoreProjects] = useState(false);
  const projectsRef = useRef<Project[]>(projects);
  const isGuestRef = useRef(isGuest);
  useEffect(() => { isGuestRef.current = isGuest; }, [isGuest]);
  const isGuestCheck = (): boolean =>
    isGuestRef.current || sessionStorage.getItem('auth_mode') === 'guest';

  // Keep ref in sync
  projectsRef.current = projects;

  const [uncategorized, setUncategorized] = useState<{
    diagrams: any[];
    notes: any[];
    drawings: any[];
    flowcharts: any[];
  }>({ diagrams: [], notes: [], drawings: [], flowcharts: [] });

  const fetchProjects = useCallback(async (isLoadMore = false, searchQuery = '') => {
    try {
      const [localProjects, uDiagrams, uNotes, uDrawings, uFlowcharts] = await Promise.all([
        localPersistence.getAllResources('project'),
        localPersistence.getAllResources('erd'),
        localPersistence.getAllResources('notes'),
        localPersistence.getAllResources('drawings'),
        localPersistence.getAllResources('flowchart'),
      ]);

      let filteredProjects = localProjects.filter(p => !p.is_deleted).map(p => ({
        ...p,
        uid: p.uid || String(p.id),
      }));
      if (searchQuery) filteredProjects = filteredProjects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const projectsWithFiles = filteredProjects.map(p => {
        const pDiag = uDiagrams.filter(f => !f.is_deleted && (String(f.project_id) === String(p.id) || String(f.project_id) === String(p.uid)));
        const pNotes = uNotes.filter(f => !f.is_deleted && (String(f.project_id) === String(p.id) || String(f.project_id) === String(p.uid)));
        const pDrawings = uDrawings.filter(f => !f.is_deleted && (String(f.project_id) === String(p.id) || String(f.project_id) === String(p.uid)));
        const pFlowcharts = uFlowcharts.filter(f => !f.is_deleted && (String(f.project_id) === String(p.id) || String(f.project_id) === String(p.uid)));
        return {
          ...p,
          diagrams: pDiag,
          notes: pNotes,
          drawings: pDrawings,
          flowcharts: pFlowcharts,
          diagrams_count: pDiag.length,
          notes_count: pNotes.length,
          drawings_count: pDrawings.length,
          flowcharts_count: pFlowcharts.length,
          files_count: pDiag.length + pNotes.length + pDrawings.length + pFlowcharts.length,
        };
      });

      if (projectsWithFiles.length > 0 || isGuestCheck()) {
        setProjects(projectsWithFiles);
        setUncategorized({
          diagrams: uDiagrams.filter(f => !f.is_deleted && !f.project_id),
          notes: uNotes.filter(f => !f.is_deleted && !f.project_id),
          drawings: uDrawings.filter(f => !f.is_deleted && !f.project_id),
          flowcharts: uFlowcharts.filter(f => !f.is_deleted && !f.project_id),
        });
        setProjectsTotal(filteredProjects.length);
        setIsLoading(false);
        if (isGuestCheck()) return;
      }
    } catch {}

    if (isGuestCheck()) {
      setIsLoading(false);
      return;
    }

    try {
      const offset = isLoadMore ? projectsRef.current.length : 0;
      const qParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      const res = await apiFetch(`/api/projects?limit=100&offset=${offset}${qParam}`);
      if (res.ok) {
        const json = await res.json();
        const projectsList = Array.isArray(json.data) ? json.data : [];
        const total = json.total !== undefined ? json.total : projectsList.length;

        if (isLoadMore) {
          setProjects(prev => [...prev, ...projectsList]);
        } else {
          setProjects(projectsList);
        }

        if (json.uncategorized) {
          setUncategorized(json.uncategorized);
        }

        setProjectsTotal(total);
        setHasMoreProjects((projectsList.length + offset) < total);
        void localPersistence.saveResourcesBatch(projectsList.map((p: any) => ({ ...p, type: 'project' })));
        return json;
      }
    } catch {} finally {
      setIsLoading(false);
    }
    return null;
  }, []);

  const createProject = async (name: string) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 11),
      uid: crypto.randomUUID(),
      name,
      is_deleted: false,
      created_at: new Date().toISOString(),
      type: 'project',
    } as Project & { type: string };

    await localPersistence.saveResource(newProject);
    setProjects(prev => [newProject, ...prev]);
    toast.success('Project created successfully');

    if (!isGuestCheck()) {
      void apiFetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, uid: newProject.uid }),
      }).then(async res => {
        if (res.ok) {
          const serverProject = await res.json().catch(() => null);
          if (serverProject?.id) {
            setProjects(prev => prev.map(p => p.uid === newProject.uid ? { ...p, id: serverProject.id } : p));
            void localPersistence.saveResource({ ...serverProject, type: 'project' });
          }
        }
      }).catch(() => {});
    }
    return newProject;
  };

  const updateProject = async (id: number | string, name: string) => {
    const idStr = String(id);
    const existing = await localPersistence.getResource(id);
    if (existing) {
      existing.name = name;
      await localPersistence.saveResource(existing);
    }
    setProjects(prev => prev.map(p => (String(p.id) === idStr || String(p.uid) === idStr) ? { ...p, name } : p));
    toast.success('Project updated successfully');

    if (!isGuestCheck()) {
      void apiFetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then(async res => {
        if (res.ok) {
          const updated = await res.json().catch(() => null);
          if (updated) void localPersistence.saveResource({ ...updated, type: 'project' });
        }
      }).catch(() => {});
    }
    return true;
  };

  const deletingProjectsRef = useRef<Set<string>>(new Set());

  const deleteProject = async (id: number | string) => {
    const idStr = String(id);
    if (deletingProjectsRef.current.has(idStr)) return false;
    deletingProjectsRef.current.add(idStr);

    try {
      const allProjects = await localPersistence.getAllResources('project');
      const project = allProjects.find((p: any) => String(p.id) === idStr || String(p.uid) === idStr);
      if (project) {
        project.is_deleted = true;
        project.deleted_at = new Date().toISOString();
        await localPersistence.saveResource(project);
      }

      setProjects(prev => prev.filter(p => String(p.id) !== idStr && String(p.uid) !== idStr));
      if (String(activeProjectId) === idStr) {
        setActiveProjectId(null);
      }
      toast.success('Project moved to trash');

      if (!isGuestCheck()) {
        void apiFetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(() => {});
      }
      return true;
    } finally {
      deletingProjectsRef.current.delete(idStr);
    }
  };

  const restoreProject = async (id: number | string) => {
    const idStr = String(id);
    if (isGuestCheck()) {
      const allProjects = await localPersistence.getAllResources('project');
      const project = allProjects.find((p: any) => String(p.id) === idStr || String(p.uid) === idStr);
      if (project) {
        project.is_deleted = false;
        project.deleted_at = undefined;
        await localPersistence.saveResource(project);

        const targetIds = new Set([idStr, String(project.id), String(project.uid)].filter(Boolean));
        const types = ['erd', 'notes', 'drawings', 'flowchart'];
        for (const type of types) {
          const items = await localPersistence.getAllResources(type);
          const projectItems = items.filter(item => targetIds.has(String(item.project_id)));
          for (const item of projectItems) {
            item.is_deleted = false;
            item.deleted_at = undefined;
            await localPersistence.saveResource(item);
          }
        }

        fetchProjects();
        window.dispatchEvent(new CustomEvent('workspace:project-restored', { detail: { targetIds: Array.from(targetIds) } }));
        toast.success('Project and its items restored locally');
      }
      return;
    }
    await apiFetch(`/api/projects/${id}/restore`, { method: 'POST' });
    fetchProjects();
    window.dispatchEvent(new CustomEvent('workspace:project-restored', { detail: { targetIds: [idStr] } }));
  };

  const deleteProjectPermanent = async (id: number | string) => {
    const idStr = String(id);
    if (isGuestCheck()) {
      const allProjects = await localPersistence.getAllResources('project');
      const project = allProjects.find((p: any) => String(p.id) === idStr || String(p.uid) === idStr);
      if (project) {
        const targetIds = new Set([idStr, String(project.id), String(project.uid)].filter(Boolean));
        const remainingProjects = allProjects.filter((p: any) => !p.is_deleted && String(p.id) !== idStr && String(p.uid) !== idStr);
        const remainingProjectIds = new Set(remainingProjects.flatMap((p: any) => [String(p.id), String(p.uid)].filter(Boolean)));

        const types = ['erd', 'notes', 'drawings', 'flowchart'];
        for (const type of types) {
          const items = await localPersistence.getAllResources(type);
          for (const item of items) {
            if (targetIds.has(String(item.project_id)) || !item.project_id || !remainingProjectIds.has(String(item.project_id))) {
              const itemId = item.id ?? item.uid;
              await localPersistence.deleteResource(itemId);
            }
          }
        }
        await localPersistence.deleteResource(project.id ?? id);
      } else {
        await localPersistence.deleteResource(id);
      }
      setProjects(prev => prev.filter(p => String(p.id) !== idStr && String(p.uid) !== idStr));
      window.dispatchEvent(new CustomEvent('workspace:project-deleted', { detail: { targetIds: [idStr] } }));
      toast.success('Project permanently deleted from local');
      return;
    }
    await apiFetch(`/api/projects/${id}/permanent`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => String(p.id) !== idStr && String(p.uid) !== idStr));
    window.dispatchEvent(new CustomEvent('workspace:project-deleted', { detail: { targetIds: [idStr] } }));
  };

  return {
    projects,
    setProjects,
    uncategorized,
    setUncategorized,
    activeProjectId,
    setActiveProjectId,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    restoreProject,
    deleteProjectPermanent,
    hasMoreProjects,
    projectsTotal,
    isLoading
  };
}

