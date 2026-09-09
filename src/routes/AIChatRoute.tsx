import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { useAIAction } from '@/contexts/AIActionContext';
import { AIChatPanel } from '@/components/ai/AIChatPanel';

export function AIChatRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    projects,
    notes,
    diagrams,
    flowcharts,
    drawings,
    selectedWorkspaceUid,
    activeProjectId: workspaceActiveProjectId,
    activeNote,
    activeDiagram,
    activeFlowchart,
  } = useWorkspace();

  const {
    pendingPrompt,
    clearPrompt,
    pendingAction,
    clearPendingAction,
  } = useAIAction();

  const projectParam = searchParams.get('project') || searchParams.get('workspace');
  const activeProjectId = useMemo(() => {
    if (projectParam) {
      const match = projects.find(
        (p: any) => String(p.uid) === String(projectParam) || String(p.id) === String(projectParam)
      );
      if (match) return match.id;
    }
    if (selectedWorkspaceUid) {
      const match = projects.find((p: any) => String(p.uid) === String(selectedWorkspaceUid));
      if (match) return match.id;
    }
    return workspaceActiveProjectId ?? null;
  }, [projectParam, selectedWorkspaceUid, projects, workspaceActiveProjectId]);

  const entityTypeParam = searchParams.get('entityType');
  const entityUidParam = searchParams.get('entityUid');

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-background">
      <AIChatPanel
        layout="page"
        projectId={activeProjectId}
        entityType={entityTypeParam || undefined}
        entityUid={entityUidParam || undefined}
        entityTitle={
          entityTypeParam === 'note' ? activeNote?.title :
          entityTypeParam === 'diagram' ? activeDiagram?.name :
          entityTypeParam === 'flowchart' ? activeFlowchart?.title : undefined
        }
        pendingPrompt={pendingPrompt}
        onPromptUsed={clearPrompt}
        pendingAction={pendingAction}
        onClearPendingAction={clearPendingAction}
        notes={notes}
        diagrams={diagrams}
        flowcharts={flowcharts}
        drawings={drawings}
        onOpenExternalAI={() => navigate('/ai-generator')}
      />
    </div>
  );
}
