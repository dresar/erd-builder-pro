import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Loader2 } from 'lucide-react';

interface DuplicateDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  view: string;
  duplicateName: string;
  setDuplicateName: (name: string) => void;
  executeDuplicate: () => void;
  isRefreshing: boolean;
}

export const DuplicateDocumentDialog: React.FC<DuplicateDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  view,
  duplicateName,
  setDuplicateName,
  executeDuplicate,
  isRefreshing,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Duplikat Dokumen</DialogTitle>
          <DialogDescription>
            Buat salinan dari {view === 'erd' ? 'ERD' : view === 'notes' ? 'catatan' : view === 'drawings' ? 'gambar' : 'flowchart'} ini.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="duplicate-input" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
                Nama Baru
              </FieldLabel>
              <Input
                id="duplicate-input"
                type="text"
                placeholder="Nama"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && duplicateName.trim()) {
                    executeDuplicate();
                  }
                }}
                autoFocus
              />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={executeDuplicate}
            disabled={!duplicateName.trim() || isRefreshing}
          >
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyalin...
              </>
            ) : "Duplikat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
