import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   description: string;
   isLoading?: boolean;
}

export default function ConfirmDialog({
   isOpen,
   onClose,
   onConfirm,
   title,
   description,
   isLoading = false
}: DeleteConfirmDialogProps) {
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>
                  {description}
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button onClick={onClose} disabled={isLoading}>
                  Batal
               </Button>
               <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
               >
                  {isLoading ? 'Menghapus...' : 'Hapus'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}