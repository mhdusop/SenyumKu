import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Pemeriksaan } from '@/interfaces/pemeriksaan';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';

interface PemeriksaanTableProps {
   pemeriksaanList: Pemeriksaan[];
}

export default function PemeriksaanTable({ pemeriksaanList }: PemeriksaanTableProps) {
   return (
      <div className="bg-white rounded-lg shadow p-4">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>Dokter</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Diagnosa</TableHead>
                  <TableHead>Tanggal Pemeriksaan</TableHead>
                  <TableHead className='text-center'>Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {pemeriksaanList.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center text-gray-500">
                        Tidak ada pemeriksaan yang terdaftar
                     </TableCell>
                  </TableRow>
               ) : (
                  pemeriksaanList.map((pemeriksaan) => (
                     <TableRow key={pemeriksaan.id}>
                        <TableCell className="font-medium">{pemeriksaan.pasien.nama}</TableCell>
                        <TableCell>{pemeriksaan.dokter?.nama}</TableCell>
                        <TableCell>{pemeriksaan.keluhan}</TableCell>
                        <TableCell>{pemeriksaan.diagnosa}</TableCell>
                        <TableCell>
                           {new Date(pemeriksaan.tanggal).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                           })}
                        </TableCell>
                        <TableCell className='justify-center flex items-center gap-3'>
                           <span className='cursor-pointer'>
                              <Pencil size={16} className='text-yellow-500' />
                           </span>
                           <span className='cursor-pointer'>
                              <Trash size={16} className='text-red-500' />
                           </span>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   );
}