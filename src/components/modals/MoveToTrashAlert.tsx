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
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

type ConfirmMode = 'move-to-trash' | 'permanent-delete';

interface MoveToTrashAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: ConfirmMode;
  activeDocument?: any;
  view?: string;
  deleteDiagram?: (id: number | string) => Promise<void> | void;
  deleteNote?: (uid: string) => Promise<void> | void;
  deleteDrawing?: (uid: string) => Promise<void> | void;
  deleteFlowchart?: (uid: string) => Promise<void> | void;
  deleteProject?: (id: number | string) => Promise<void> | void;
  fetchTrash?: () => void;
  itemType?: string;
  onConfirm?: () => void;
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
  const [isLoading, setIsLoading] = React.useState(false);
  const isExecutingRef = React.useRef(false);

  React.useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      isExecutingRef.current = false;
    }
  }, [isOpen]);

  const handleConfirm = async (e?: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (isExecutingRef.current || isLoading) return;
    isExecutingRef.current = true;
    setIsLoading(true);

    try {
      if (mode === 'permanent-delete') {
        await onConfirm?.();
        onAfterDelete?.();
        onOpenChange(false);
        return;
      }

      if (onConfirm) {
        await onConfirm();
        onAfterDelete?.();
        onOpenChange(false);
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
    } finally {
      setIsLoading(false);
      isExecutingRef.current = false;
    }
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
      <AlertDialog open={isOpen} onOpenChange={isLoading ? () => {} : onOpenChange}>
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
            <AlertDialogCancel disabled={isLoading} onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              disabled={isLoading} 
              onClick={handleConfirm} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="size-4 animate-spin shrink-0" />}
              <span>{isLoading ? 'Menghapus...' : 'Hapus Permanen'}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  const isDocument = view !== 'project';
  return (
    <AlertDialog open={isOpen} onOpenChange={isLoading ? () => {} : onOpenChange}>
      <AlertDialogContent size="sm" className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10">
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
          <AlertDialogCancel disabled={isLoading} onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            disabled={isLoading} 
            onClick={handleConfirm}
            className="gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 className="size-4 animate-spin shrink-0" />}
            <span>{isLoading ? 'Menghapus...' : (isDocument ? 'Ke Sampah' : 'Hapus')}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
