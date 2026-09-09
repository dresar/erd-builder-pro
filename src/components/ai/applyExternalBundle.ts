import { toast } from 'sonner';
import { autoFixDBMLEnumNames } from '@/lib/dbml-utils';
import { dbmlToERD } from '@/lib/dbml-converter';
import { edgeToRelationship } from '@/lib/diagram-payload';
import { apiFetch } from '@/lib/api';
import { localPersistence } from '@/lib/localPersistence';
import { DraftType } from '@/types';
import type { ParsedExternalBundle } from './externalBundleTypes';

export interface ApplyExternalBundleParams {
  parsedData: ParsedExternalBundle;
  targetMode: 'new_project' | 'current_project' | 'current_workspace';
  selectedWorkspaceUid: string | null;
  projectName: string;
  handleSidebarProjectCreate: (name: string) => Promise<any>;
  handleSidebarPrdCreate: (title: string, projectId?: string | null, content?: string, options?: { silent?: boolean }) => Promise<any>;
  handleSidebarFlowchartCreate: (title: string, projectId?: string | null, data?: string, options?: { silent?: boolean }) => Promise<any>;
  handleSidebarDiagramCreate: (title: string, projectId?: string | null, options?: { silent?: boolean }) => Promise<any>;
  handleDiagramSelect: (id: any) => Promise<any>;
  handleViewChange: (view: any, immediate?: boolean, projectId?: string | null) => Promise<void>;
  onClose: () => void;
}

export async function applyExternalBundle({
  parsedData,
  targetMode,
  selectedWorkspaceUid,
  projectName,
  handleSidebarProjectCreate,
  handleSidebarPrdCreate,
  handleSidebarFlowchartCreate,
  handleSidebarDiagramCreate,
  handleDiagramSelect,
  handleViewChange,
  onClose,
}: ApplyExternalBundleParams) {
  let projectId: string | null = null;
  const effectiveName = parsedData.project?.name?.trim() || projectName.trim() || 'Proyek Enterprise';

  if (targetMode === 'new_project' || !selectedWorkspaceUid) {
    toast.info('Membuat proyek...');
    const newProj = await handleSidebarProjectCreate(effectiveName);
    projectId = newProj ? String(newProj.uid ?? newProj.id) : null;
  } else {
    projectId = selectedWorkspaceUid || null;
  }

  if (!projectId) {
    const newProj = await handleSidebarProjectCreate(effectiveName);
    projectId = newProj ? String(newProj.uid ?? newProj.id) : null;
  }

  if (parsedData.prd?.content_markdown) {
    toast.info('Menyimpan PRD...');
    const rawTitle = parsedData.prd.title || `Spesifikasi - ${effectiveName}`;
    const cleanPrdTitle = (rawTitle.includes('SPESIFIKASI PERSYARATAN') || rawTitle === 'Spesifikasi PRD') ? effectiveName : rawTitle;
    localStorage.setItem('pending_note_content', parsedData.prd.content_markdown);
    localStorage.setItem('pending_prd_content', parsedData.prd.content_markdown);
    localStorage.setItem('pending_note_strategy', 'replace');
    await handleSidebarPrdCreate(cleanPrdTitle, projectId, parsedData.prd.content_markdown, { silent: true });
  }

  if (parsedData.flowchart?.nodes && parsedData.flowchart.nodes.length > 0) {
    toast.info('Menyimpan Flowchart...');
    const fcTitle = parsedData.flowchart.title || `Alur - ${effectiveName}`;
    const fcJson = JSON.stringify(parsedData.flowchart);
    localStorage.setItem('pending_create_flowchart_json', fcJson);
    await handleSidebarFlowchartCreate(fcTitle, projectId, fcJson, { silent: Boolean(parsedData.erd?.dbml) });
  }

  if (parsedData.erd?.dbml) {
    toast.info('Membuat & menyimpan ERD ke database...');
    const healedDbml = autoFixDBMLEnumNames(parsedData.erd.dbml);
    const erdBundlename = parsedData.erd.title || `ERD - ${effectiveName}`;
    const newDiagram = await handleSidebarDiagramCreate(erdBundlename, projectId, { silent: true });

    if (newDiagram) {
      const targetUid = newDiagram.uid || newDiagram.id;
      try {
        const parsed = dbmlToERD(healedDbml);
        const entities = (parsed.nodes || []).map((n: any) => ({
          ...n.data,
          x: n.position?.x || 0,
          y: n.position?.y || 0,
        }));
        const relationships = (parsed.edges || []).map(edgeToRelationship);

        await apiFetch(`/api/diagrams/save/${targetUid}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            entities,
            relationships,
            viewport: { x: 0, y: 0, zoom: 1 },
            dbml_source: healedDbml,
          }),
        });

        const draftData = JSON.stringify({
          nodes: parsed.nodes,
          edges: parsed.edges,
          viewport: { x: 0, y: 0, zoom: 1 },
          dbml_source: healedDbml,
        });
        await localPersistence.saveDraft(DraftType.ERD, targetUid, draftData, false);
      } catch (err) {
        console.error('Error pre-saving ERD schema:', err);
      }

      localStorage.setItem('pending_create_erd_schema', healedDbml);
      await handleDiagramSelect(targetUid);
    }
  } else if (parsedData.flowchart?.nodes && parsedData.flowchart.nodes.length > 0) {
    await handleViewChange('flowchart', true, projectId);
  } else {
    await handleViewChange('notes', true, projectId);
  }

  toast.success('✓ Semua data berhasil disimpan ke database!');
  onClose();
}
