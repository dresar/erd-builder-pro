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
import { AlertTriangle } from 'lucide-react';

interface DeleteEntityAlertProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEntity: any | null;
  deleteEntity: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
}

export const DeleteEntityAlert: React.FC<DeleteEntityAlertProps> = ({
  isOpen,
  onOpenChange,
  selectedEntity,
  deleteEntity,
  setSelectedNodeId,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus Tabel</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogBody>
          <AlertDialogDescription>
            Hapus tabel <strong>{selectedEntity?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogBody>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              if (selectedEntity) {
                deleteEntity(selectedEntity.id);
                setSelectedNodeId(null);
                onOpenChange(false);
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
