import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

interface ConfirmDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
   title: string;
   description: string;
}

export function ConfirmDialog({
   open,
   onOpenChange,
   onConfirm,
   title,
   description,
}: ConfirmDialogProps) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
               <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <DialogClose asChild>
                  <Button variant="outline">Batal</Button>
               </DialogClose>
               <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
                  Hapus
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}