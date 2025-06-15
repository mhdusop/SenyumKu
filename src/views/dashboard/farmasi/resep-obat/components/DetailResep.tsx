/* eslint-disable @typescript-eslint/no-explicit-any */
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DetailResepProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   resep: any | null;
   onProcessResep: () => void;
}

export default function DetailResep({
   open,
   onOpenChange,
   resep,
   onProcessResep,
}: DetailResepProps) {
   if (!resep) return null;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Detail Resep #{resep.id}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-3">
                  <div>
                     <h4 className="text-sm font-medium text-muted-foreground">Dokter</h4>
                     <p className="text-base">{resep.dokter?.nama || '-'}</p>
                     <p className="text-sm text-muted-foreground">{resep.dokter?.spesialisasi || '-'}</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div>
                     <h4 className="text-sm font-medium text-muted-foreground">Obat</h4>
                     <p className="text-base">{resep.obat?.nama || '-'}</p>
                     <p className="text-sm">
                        Jumlah: {resep.jumlah} {resep.obat?.satuan || ''}
                        <span className="ml-2 text-muted-foreground">
                           (Stok: {resep.obat?.stok || 0})
                        </span>
                     </p>
                  </div>

                  <div>
                     <h4 className="text-sm font-medium text-muted-foreground">Aturan Pakai</h4>
                     <p className="text-base">{resep.aturan || '-'}</p>
                  </div>
               </div>
            </div>

            <div className="mt-2">
               <h4 className="text-sm font-medium text-muted-foreground">Diagnosa</h4>
               <p className="text-base">{resep.rekamMedis?.pemeriksaan?.diagnosa || '-'}</p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
               {(resep.status === 'BARU' || resep.status === 'DIPROSES') && (
                  <Button
                     onClick={onProcessResep}
                     className="w-full sm:w-auto"
                  >
                     Proses Resep
                  </Button>
               )}
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
               >
                  Tutup
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}