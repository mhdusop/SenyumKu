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
import { Eye, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Pasien</TableHead>
                  <TableHead>Obat</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
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
                        <TableCell>
                           {resep.createdAt && format(new Date(resep.createdAt), 'dd MMM yyyy', { locale: id })}
                        </TableCell>
                        <TableCell>{resep.dokter?.nama || '-'}</TableCell>
                        <TableCell>
                           {resep.rekamMedis?.pasien?.nama || '-'}
                        </TableCell>
                        <TableCell>{resep.obat?.nama || '-'}</TableCell>
                        <TableCell>
                           {resep.jumlah} {resep.obat?.satuan || ''}
                        </TableCell>
                        <TableCell>{renderStatusBadge(resep.status || 'BARU')}</TableCell>
                        <TableCell className="text-right">
                           <div className="flex justify-end gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => onViewDetail(resep.id)}
                              >
                                 <Eye className="h-4 w-4" />
                              </Button>
                              {(resep.status === 'BARU' || resep.status === 'DIPROSES') && (
                                 <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onProcessResep(resep.id)}
                                 >
                                    <CheckCircle className="h-4 w-4" />
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