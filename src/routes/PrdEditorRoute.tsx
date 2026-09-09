import React, { Suspense, useEffect, useRef } from 'react';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { useParams, useSearchParams } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { ProjectFileTabs } from '@/components/ProjectFileTabs';

const PRDView = React.lazy(() => import('@/components/prd/PRDView').then(m => ({ default: m.PRDView })));

export function PrdEditorRoute() {
  const ctx = useWorkspace();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isFocusMode = searchParams.get('focus') === '1' || searchParams.get('fullscreen') === '1';

  const {
    activeNote, activeNoteUid, saveNote, handleNoteChange, deleteNote,
    isPublicView, isNoteItemLoading, handleNoteSelect,
  } = ctx;

  const processedUrlRef = useRef(false);
  useEffect(() => {
    if (isPublicView || !id) return;
    if (processedUrlRef.current) return;
    if (activeNoteUid === id) {
      processedUrlRef.current = true;
      return;
    }
    if (!activeNoteUid) {
      processedUrlRef.current = true;
      handleNoteSelect(id);
    }
  }, [id, activeNoteUid, isPublicView, handleNoteSelect]);

  if (!isPublicView && !activeNoteUid) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border rounded-xl bg-muted/10">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="mt-3 text-xs text-muted-foreground animate-pulse">Memuat PRD...</p>
      </div>
    );
  }

  if (!activeNote && !isNoteItemLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border rounded-xl bg-muted/10 p-6 text-center">
        <FileQuestion className="size-10 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-semibold text-foreground">PRD tidak ditemukan</p>
        <p className="text-xs text-muted-foreground mt-1">Dokumen mungkin telah dihapus.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {!isFocusMode && <ProjectFileTabs currentView="prd" currentFile={activeNote} />}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">Memuat...</div>}>
          <PRDView
            activePrdUid={activeNoteUid}
            activePrd={activeNote}
            savePrd={saveNote}
            handlePrdChange={handleNoteChange}
            deletePrd={deleteNote}
            isLoading={isNoteItemLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}
