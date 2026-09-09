import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useWorkspace } from '@/providers/WorkspaceProvider';

import { NotesTableView } from '@/components/views/NotesTableView';
import { PRDTableView } from '@/components/prd/PRDTableView';
import { ErdTableView } from '@/components/views/ErdTableView';
import { DrawingsTableView } from '@/components/views/DrawingsTableView';
import { FlowchartTableView } from '@/components/views/FlowchartTableView';
import { WelcomeView } from '@/components/views/WelcomeView';
import { DbClientTableRoute } from './DbClientTableRoute';

export function TableRoute() {
  const { feature } = useParams<{ feature: string }>();
  const navigate = useNavigate();
  const {
    notes, notesTotal, diagrams, diagramsTotal, drawings, drawingsTotal,
    flowcharts, flowchartsTotal, projects,
    selectedWorkspaceUid, tableSearchParams, setTableSearchParams,
    handleNoteSelect, handleDiagramSelect, handleDrawingSelect, handleFlowchartSelect,
    handleOpenEditDocument, handleOpenCreateDocument,
    setItemToDelete, setIsMoveToTrashAlertOpen,
    setTableDeleteDoc,
    isNotesLoading, isDiagramsLoading, isDrawingsLoading, isFlowchartsLoading,
    setTableLoadingState,
    fileSearchQuery, setFileSearchQuery, fileSearchRef,
  } = useWorkspace();

  const openDiagram = (uid: string) => handleDiagramSelect(uid);

  const tablePage = parseInt(tableSearchParams.get('page') || '1', 10);

  const handlePageChange = (p: number) => {
    setTableLoadingState('loading');
    const params = new URLSearchParams(tableSearchParams);
    params.set('page', String(p));
    setTableSearchParams(params, { replace: true });
  };

  const handleWorkspaceClick = (uid: string | null) => {
    setTableLoadingState('loading');
    const params = new URLSearchParams(tableSearchParams);
    if (uid) {
      params.set('workspace', uid);
    } else {
      params.delete('workspace');
    }
    params.set('page', '1');
    setTableSearchParams(params, { replace: true });
  };

  const makeDeleteHandler = (items: any[] | undefined | null) => (uid: string) => {
    const item = items?.find((n: any) => n.uid === uid || String(n.id) === uid || n.key === uid);
    if (!item) return;
    setItemToDelete({ id: item.id || item.uid, type: item.type, uid: item.uid });
    setTableDeleteDoc(item);
    setIsMoveToTrashAlertOpen(true);
  };

  const hasActiveProjects = (projects || []).length > 0;
  const activeIds = React.useMemo(() => {
    return new Set((projects || []).flatMap((p: any) => [String(p.id), String(p.uid)].filter(Boolean)));
  }, [projects]);

  const prdNotes = React.useMemo(() => {
    if (!hasActiveProjects) return [];
    const seen = new Set<string>();
    return (notes || []).filter((n: any) => {
      if (!n || !n.title?.startsWith('[PRD] ') || !n.project_id || !activeIds.has(String(n.project_id))) return false;
      const key = String(n.uid ?? n.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [notes, hasActiveProjects, activeIds]);

  const regularNotes = React.useMemo(() => {
    if (!hasActiveProjects) return [];
    const seen = new Set<string>();
    return (notes || []).filter((n: any) => {
      if (!n || n.title?.startsWith('[PRD] ') || !n.project_id || !activeIds.has(String(n.project_id))) return false;
      const key = String(n.uid ?? n.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [notes, hasActiveProjects, activeIds]);

  const validDiagrams = React.useMemo(() => {
    if (!hasActiveProjects) return [];
    const seen = new Set<string>();
    return (diagrams || []).filter((d: any) => {
      if (!d || !d.project_id || !activeIds.has(String(d.project_id))) return false;
      const key = String(d.uid ?? d.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [diagrams, hasActiveProjects, activeIds]);

  const validDrawings = React.useMemo(() => {
    if (!hasActiveProjects) return [];
    const seen = new Set<string>();
    return (drawings || []).filter((d: any) => {
      if (!d || !d.project_id || !activeIds.has(String(d.project_id))) return false;
      const key = String(d.uid ?? d.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [drawings, hasActiveProjects, activeIds]);

  const validFlowcharts = React.useMemo(() => {
    if (!hasActiveProjects) return [];
    const seen = new Set<string>();
    return (flowcharts || []).filter((f: any) => {
      if (!f || !f.project_id || !activeIds.has(String(f.project_id))) return false;
      const key = String(f.uid ?? f.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [flowcharts, hasActiveProjects, activeIds]);

  switch (feature) {
    case 'notes':
      return (
        <NotesTableView
          notes={regularNotes}
          projects={projects}
          selectedWorkspace={selectedWorkspaceUid}
          page={tablePage}
          totalNotes={regularNotes.length}
          isLoading={isNotesLoading}
          onSelectNote={handleNoteSelect}
          onCreateNote={() => handleOpenCreateDocument('notes')}
          onPageChange={handlePageChange}
          onWorkspaceClick={handleWorkspaceClick}
          onOpenEditDocument={(uid: string) => handleOpenEditDocument(uid)}
          onDeleteNote={makeDeleteHandler(notes)}
          searchQuery={fileSearchQuery}
          onSearchChange={setFileSearchQuery}
          searchRef={fileSearchRef}
        />
      );
    case 'prd':
      return (
        <PRDTableView
          prds={prdNotes}
          projects={projects}
          selectedWorkspace={selectedWorkspaceUid}
          page={tablePage}
          totalPrds={prdNotes.length}
          isLoading={isNotesLoading}
          onSelectPrd={(uid) => navigate(`/prd/${uid}`)}
          onCreatePrd={() => handleOpenCreateDocument('prd')}
          onPageChange={handlePageChange}
          onWorkspaceClick={handleWorkspaceClick}
          onOpenEditDocument={(uid: string) => handleOpenEditDocument(uid)}
          onDeletePrd={makeDeleteHandler(notes)}
          searchQuery={fileSearchQuery}
          onSearchChange={setFileSearchQuery}
          searchRef={fileSearchRef}
        />
      );
    case 'erd':
      return (
        <ErdTableView
          diagrams={validDiagrams}
          projects={projects}
          selectedWorkspace={selectedWorkspaceUid}
          page={tablePage}
          totalDiagrams={validDiagrams.length}
          isLoading={isDiagramsLoading}
          onSelectDiagram={(uid) => openDiagram(uid)}
          onCreateDiagram={() => handleOpenCreateDocument('erd')}
          onPageChange={handlePageChange}
          onWorkspaceClick={handleWorkspaceClick}
          onOpenEditDocument={(uid: string) => handleOpenEditDocument(uid)}
          onDeleteDiagram={makeDeleteHandler(diagrams)}
          searchQuery={fileSearchQuery}
          onSearchChange={setFileSearchQuery}
          searchRef={fileSearchRef}
        />
      );
    case 'db-client':
      return <DbClientTableRoute />;
    case 'drawings':
      return (
        <DrawingsTableView
          drawings={validDrawings}
          projects={projects}
          selectedWorkspace={selectedWorkspaceUid}
          page={tablePage}
          totalDrawings={validDrawings.length}
          isLoading={isDrawingsLoading}
          onSelectDrawing={handleDrawingSelect}
          onCreateDrawing={() => handleOpenCreateDocument('drawings')}
          onPageChange={handlePageChange}
          onWorkspaceClick={handleWorkspaceClick}
          onOpenEditDocument={(uid: string) => handleOpenEditDocument(uid)}
          onDeleteDrawing={makeDeleteHandler(drawings)}
          searchQuery={fileSearchQuery}
          onSearchChange={setFileSearchQuery}
          searchRef={fileSearchRef}
        />
      );
    case 'flowchart':
    case 'flowcharts':
      return (
        <FlowchartTableView
          flowcharts={validFlowcharts}
          projects={projects}
          selectedWorkspace={selectedWorkspaceUid}
          page={tablePage}
          totalFlowcharts={validFlowcharts.length}
          isLoading={isFlowchartsLoading}
          onSelectFlowchart={handleFlowchartSelect}
          onCreateFlowchart={() => handleOpenCreateDocument('flowchart')}
          onPageChange={handlePageChange}
          onWorkspaceClick={handleWorkspaceClick}
          onOpenEditDocument={(uid: string) => handleOpenEditDocument(uid)}
          onDeleteFlowchart={makeDeleteHandler(flowcharts)}
          searchQuery={fileSearchQuery}
          onSearchChange={setFileSearchQuery}
          searchRef={fileSearchRef}
        />
      );
    default:
      return <WelcomeView />;
  }
}
