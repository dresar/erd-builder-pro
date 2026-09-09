import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';

interface RenameDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** 'edit' = rename + move workspace (existing behavior). 'create' = create new document. */
  mode?: 'edit' | 'create';
  view: string;
  activeDocument: any | null;
  newName: string;
  setNewName: (name: string) => void;
  projects: any[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  /** For create mode — called with (title, projectId) when user confirms */
  onCreate?: (title: string, projectId: string | null) => void;
  /** For edit mode */
  updateDiagram?: (id: string | number, name: string, options?: { silent?: boolean }) => void;
  updateNote?: (uid: string, name: string, options?: { silent?: boolean }) => void;
  updateDrawing?: (uid: string, name: string, options?: { silent?: boolean }) => void;
  updateFlowchart?: (uid: string, name: string, options?: { silent?: boolean }) => void;
  onMoveDiagramToProject?: (id: number | string, projectId: number | string | null, options?: { silent?: boolean }) => Promise<boolean | undefined>;
  onMoveNoteToProject?: (uid: string, projectId: number | string | null, options?: { silent?: boolean }) => Promise<boolean | undefined>;
  onMoveDrawingToProject?: (uid: string, projectId: number | string | null, options?: { silent?: boolean }) => Promise<boolean | undefined>;
  onMoveFlowchartToProject?: (uid: string, projectId: number | string | null, options?: { silent?: boolean }) => Promise<boolean | undefined>;
  onRenameSuccess?: () => Promise<void>;
}

const viewLabel = (v: string) =>
  v === 'erd' ? 'ERD' : v === 'prd' ? 'PRD' : v === 'notes' ? 'catatan' : v === 'drawings' ? 'gambar' : 'flowchart';

export const RenameDocumentDialog: React.FC<RenameDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  mode = 'edit',
  view,
  activeDocument,
  newName,
  setNewName,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onCreate,
  updateDiagram,
  updateNote,
  updateDrawing,
  updateFlowchart,
  onMoveDiagramToProject,
  onMoveNoteToProject,
  onMoveDrawingToProject,
  onMoveFlowchartToProject,
  onRenameSuccess,
}) => {
  const isCreate = mode === 'create';

  useEffect(() => {
    if (isOpen) {
      if (isCreate) {
        if ((!selectedProjectId || selectedProjectId === 'none') && projects.length > 0) {
          setSelectedProjectId(projects[0].id.toString());
        }
      } else if (activeDocument) {
        const pid = activeDocument?.project_id ?? activeDocument?.projectId;
        setSelectedProjectId(pid != null ? String(pid) : 'none');
      }
    }
  }, [isOpen, isCreate, projects]);

  const handleSave = async () => {
    if (!newName.trim()) return;

    if (isCreate) {
      if (!selectedProjectId || selectedProjectId === 'none') {
        toast.error('Wajib memilih ruang kerja untuk dokumen baru');
        return;
      }
      onCreate?.(newName.trim(), selectedProjectId);
      onOpenChange(false);
      return;
    }

    // Edit mode — existing behavior
    const id = view === 'notes' || view === 'prd' || view === 'flowchart' || view === 'drawings' ? activeDocument?.uid : activeDocument?.id;
    if (id && newName.trim()) {
      const projectId = selectedProjectId === "none" ? null : selectedProjectId;
      const currentProjectId = activeDocument?.project_id || activeDocument?.projectId;
      const hasNameChanged = newName.trim() !== (activeDocument?.title || activeDocument?.name);
      const hasProjectChanged = String(projectId) !== String(currentProjectId);

      try {
        if (hasNameChanged) {
          if (view === 'erd') await updateDiagram?.(id, newName, { silent: true });
          else if (view === 'notes' || view === 'prd') {
            const finalTitle = view === 'prd' && !newName.startsWith('[PRD] ') ? `[PRD] ${newName}` : newName;
            await updateNote?.(String(id), finalTitle, { silent: true });
          }
          else if (view === 'drawings') await updateDrawing?.(id, newName, { silent: true });
          else if (view === 'flowchart') await updateFlowchart?.(id, newName, { silent: true });
        }

        if (hasProjectChanged) {
          if (view === 'erd') await onMoveDiagramToProject?.(id, projectId, { silent: true });
          else if (view === 'notes' || view === 'prd') await onMoveNoteToProject?.(id, projectId, { silent: true });
          else if (view === 'drawings') await onMoveDrawingToProject?.(id, projectId, { silent: true });
          else if (view === 'flowchart') await onMoveFlowchartToProject?.(id, projectId, { silent: true });
        }

        if ((hasNameChanged || hasProjectChanged) && onRenameSuccess) {
          await onRenameSuccess();
        }

        toast.success('Dokumen berhasil diperbarui');
        onOpenChange(false);
      } catch (error) {
        toast.error('Gagal memperbarui dokumen');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{isCreate ? `Buat ${viewLabel(view)}` : 'Edit Dokumen'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isCreate ? `Buat ${viewLabel(view)} baru` : 'Edit dokumen'}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-3.5">
            <Field>
              <FieldLabel htmlFor="rename-input" className="text-xs font-medium text-foreground">
                {isCreate ? 'Nama' : 'Nama Baru'}
              </FieldLabel>
              <Input
                id="rename-input"
                type="text"
                placeholder="Nama"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newName.trim()) {
                    handleSave();
                  }
                }}
                autoFocus
                className="h-9"
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs font-medium text-foreground">
                Ruang Kerja
              </FieldLabel>
              {projects.length === 0 ? (
                <p className="text-xs text-amber-500/90 py-1">
                  Harap buat ruang kerja terlebih dahulu.
                </p>
              ) : (
                <Select value={selectedProjectId} onValueChange={(value) => value !== null && setSelectedProjectId(value)}>
                  <SelectTrigger className="h-9 w-full min-w-0 overflow-hidden">
                    <SelectValue className="truncate text-left block w-full">
                      {selectedProjectId === "none" ? "Tanpa Kategori" : projects.find(p => p.id.toString() === selectedProjectId)?.name || "Pilih Ruang Kerja"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-3rem)] sm:max-w-xs">
                    {!isCreate && <SelectItem value="none">Tanpa Kategori</SelectItem>}
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()} className="truncate">
                        <span className="truncate block max-w-65">{project.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>
          </div>
        </DialogBody>
        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose render={<Button variant="outline" size="sm" className="h-8.5 px-4" />}>
            Batal
          </DialogClose>
          <Button
            size="sm"
            disabled={!newName.trim() || (isCreate && (!selectedProjectId || selectedProjectId === 'none' || projects.length === 0))}
            onClick={handleSave}
            className="h-8.5 px-5 font-medium"
          >
            {isCreate ? 'Buat' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
