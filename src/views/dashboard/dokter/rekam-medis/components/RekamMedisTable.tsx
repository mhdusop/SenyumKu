import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RekamMedis } from '@/interfaces/rekam-medis';
import { Info, Trash } from 'lucide-react';

interface RekamMedisTableProps {
   rekamMedisList: RekamMedis[];
   onDelete: (rekamMedis: RekamMedis) => void;
   onViewDetail: (rekamMedis: RekamMedis) => void;
}

export default function RekamMedisTable({ rekamMedisList, onDelete, onViewDetail }: RekamMedisTableProps) {
   return (
      <div className="bg-white rounded-lg shadow p-4">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>Nama Dokter</TableHead>
                  <TableHead>Tanggal Kunjungan</TableHead>
                  <TableHead>Isi Rekam Medis</TableHead>
                  <TableHead className='text-center'>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {Array.isArray(rekamMedisList) && rekamMedisList.length > 0 ? (
                  rekamMedisList.map((rekamMedis) => (
                     <TableRow key={rekamMedis.id}>
                        <TableCell className="font-medium">{rekamMedis.pasien?.nama || 'Pasien tidak ditemukan'}</TableCell>
                        <TableCell>{rekamMedis.dokter?.nama || 'Dokter tidak ditemukan'}</TableCell>
                        <TableCell>
                           {new Date(rekamMedis.tanggal).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                           })}
                        </TableCell>
                        <TableCell>{rekamMedis.isi}</TableCell>
                        <TableCell className='justify-center flex items-center'>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewDetail(rekamMedis)}
                              className="p-2 bg-transparent hover:bg-transparent cursor-pointer"
                           >
                              <Info size={16} className='text-blue-500' />
                           </Button>
                           <Button
                              size="sm"
                              onClick={() => onDelete(rekamMedis)}
                              className="p-2 bg-transparent hover:bg-transparent cursor-pointer"
                           >
                              <Trash size={16} className='text-red-500' />
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center text-gray-500">
                        Tidak ada rekam medis yang terdaftar
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
   );
}