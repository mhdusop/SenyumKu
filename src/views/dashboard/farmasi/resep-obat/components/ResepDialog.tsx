/* eslint-disable @typescript-eslint/no-explicit-any */
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { ProcessResepData } from '@/services/farmasi/resep-service';

interface ProsesResepDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   currentStatus: string;
   onSubmit: (data: ProcessResepData) => void;
   id: number;
}

export default function ProsesResepDialog({
   open,
   onOpenChange,
   currentStatus,
   onSubmit,
   id,
}: ProsesResepDialogProps) {
   const [status, setStatus] = useState<ProcessResepData['status']>(
      currentStatus === 'BARU' ? 'DIPROSES' : 'SELESAI'
   );
   const [catatan, setCatatan] = useState<string>('');
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async () => {
      setIsLoading(true);
      try {
         await onSubmit({
            status,
            catatan: catatan || undefined,
         });
         onOpenChange(false);
      } catch (error) {
         console.error('Error processing resep:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Proses Resep #{id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="status">Status Resep</Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                     <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                     </SelectTrigger>
                     <SelectContent>
                        {currentStatus === 'BARU' && (
                           <SelectItem value="DIPROSES">Diproses</SelectItem>
                        )}
                        {(currentStatus === 'BARU' || currentStatus === 'DIPROSES') && (
                           <SelectItem value="SELESAI">Selesai</SelectItem>
                        )}
                        <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan (Opsional)</Label>
                  <Textarea
                     id="catatan"
                     placeholder="Tambahkan catatan jika diperlukan"
                     value={catatan}
                     onChange={(e: any) => setCatatan(e.target.value)}
                  />
               </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
               <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
               >
                  {isLoading ? 'Memproses...' : 'Simpan'}
               </Button>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
               >
                  Batal
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}