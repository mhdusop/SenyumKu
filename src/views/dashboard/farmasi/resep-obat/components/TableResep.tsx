/* eslint-disable @typescript-eslint/no-explicit-any */
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface TabelResepProps {
   resepList: any[];
   onViewDetail: (id: number) => void;
   onProcessResep: (id: number) => void;
}

export default function TabelResep({
   resepList,
   onViewDetail,
   onProcessResep,
}: TabelResepProps) {
   const renderStatusBadge = (status: string) => {
      switch (status) {
         case 'BARU':
            return <Badge className="bg-blue-100 text-blue-800">Baru</Badge>;
         case 'DIPROSES':
            return <Badge className="bg-yellow-100 text-yellow-800">Diproses</Badge>;
         case 'SELESAI':
            return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
         case 'DIBATALKAN':
            return <Badge className="bg-red-100 text-red-800">Dibatalkan</Badge>;
         default:
            return <Badge>{status}</Badge>;
      }
   };

   return (
      <div className="border rounded-md bg-white">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Obat</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {resepList.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className="text-center">
                        Tidak ada data resep
                     </TableCell>
                  </TableRow>
               ) : (
                  resepList.map((resep) => (
                     <TableRow key={resep.id}>
                        <TableCell>{resep.dokter?.nama || '-'}</TableCell>
                        <TableCell>
                           {resep.rekamMedis?.pasien?.nama || '-'}
                        </TableCell>
                        <TableCell>{resep.obat?.nama || '-'}</TableCell>
                        <TableCell>
                           {resep.jumlah} {resep.obat?.satuan || ''}
                        </TableCell>
                        <TableCell>{renderStatusBadge(resep.status || 'BARU')}</TableCell>
                        <TableCell className="text-center">
                           <div className="flex justify-center gap-2">
                              <Button
                                 className='bg-transparent hover:bg-transparent shadow-none cursor-pointer'
                                 size="sm"
                                 onClick={() => onViewDetail(resep.id)}
                              >
                                 <Info size={16} className='text-blue-500' />
                              </Button>
                              {(resep.status === 'BARU' || resep.status === 'DIPROSES') && (
                                 <Button
                                    size="sm"
                                    className='bg-transparent hover:bg-transparent shadow-none cursor-pointer'
                                    onClick={() => onProcessResep(resep.id)}
                                 >
                                    <Info size={16} className='text-blue-500' />
                                 </Button>
                              )}
                           </div>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   );
}