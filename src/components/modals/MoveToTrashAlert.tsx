import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogBody,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

type ConfirmMode = 'move-to-trash' | 'permanent-delete';

interface MoveToTrashAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: ConfirmMode;

  // For 'move-to-trash' mode: the document or project being moved
  activeDocument?: any;
  view?: string; // 'erd' | 'notes' | 'drawings' | 'flowchart' | 'project'
  deleteDiagram?: (id: number | string) => Promise<void> | void;
  deleteNote?: (uid: string) => Promise<void> | void;
  deleteDrawing?: (uid: string) => Promise<void> | void;
  deleteFlowchart?: (uid: string) => Promise<void> | void;
  deleteProject?: (id: number | string) => Promise<void> | void;
  fetchTrash?: () => void;

  // For 'permanent-delete' mode: simple confirmation callback
  itemType?: string;
  onConfirm?: () => void;

  /** Called after successful action — e.g. to redirect to table view */
  onAfterDelete?: () => void;
}

export const MoveToTrashAlert: React.FC<MoveToTrashAlertProps> = ({
  isOpen,
  onOpenChange,
  mode = 'move-to-trash',
  activeDocument,
  view,
  deleteDiagram,
  deleteNote,
  deleteDrawing,
  deleteFlowchart,
  deleteProject,
  fetchTrash,
  itemType,
  onConfirm,
  onAfterDelete,
}) => {
  const handleConfirm = async () => {
    if (mode === 'permanent-delete') {
      onConfirm?.();
      onAfterDelete?.();
      return;
    }

    // move-to-trash mode: allow caller-provided confirm callback
    if (onConfirm) {
      onConfirm();
      onAfterDelete?.();
      return;
    }

    const currentId = view === 'erd' || view === 'notes' || view === 'flowchart' || view === 'drawings'
      ? (activeDocument?.uid ?? activeDocument?.id)
      : activeDocument?.id;
    if (!currentId) return;
    if (view === 'erd') await deleteDiagram?.(currentId);
    else if (view === 'notes') await deleteNote?.(String(currentId));
    else if (view === 'drawings') await deleteDrawing?.(currentId);
    else if (view === 'flowchart') await deleteFlowchart?.(currentId);
    else if (view === 'project') await deleteProject?.(currentId);
    fetchTrash?.();
    onOpenChange(false);
    onAfterDelete?.();
  };

  const itemLabel = itemType === 'erd' ? 'ERD'
    : itemType === 'notes' ? 'catatan'
    : itemType === 'drawings' ? 'gambar'
    : itemType === 'flowchart' ? 'flowchart'
    : itemType === 'project' ? 'ruang kerja'
    : 'item';

  if (mode === 'permanent-delete') {
    const isProject = itemType === 'project';
    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent size="sm" className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Hapus Permanen?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogBody>
            <AlertDialogDescription>
              {isProject ? (
                <>Tindakan ini tidak dapat dibatalkan. Menghapus ruang kerja ini juga akan menghapus permanen semua
                  <strong> catatan, ERD, gambar, dan flowchart</strong> di dalamnya.</>
              ) : (
                <>Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen <strong>{itemLabel}</strong> dari server.</>
              )}
            </AlertDialogDescription>
          </AlertDialogBody>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // move-to-trash mode
  const isDocument = view !== 'project';
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogMedia className={isDocument ? 'bg-destructive/10' : 'bg-destructive/10'}>
            <Trash2 className="w-5 h-5 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>{isDocument ? 'Pindahkan ke Sampah?' : 'Hapus Ruang Kerja?'}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            {isDocument ? (
              <>
                Pindahkan <strong>{activeDocument?.title || activeDocument?.name || 'item ini'}</strong> ke sampah?
                <br />
                Item dapat dipulihkan kembali nanti melalui menu Sampah.
              </>
            ) : (
              <>
                Memindahkan ruang kerja dan semua file di dalamnya ke sampah.
                <br />
                Dapat dipulihkan kembali nanti melalui menu Sampah.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {isDocument ? 'Ke Sampah' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
