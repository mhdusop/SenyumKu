import React, { useState } from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pemeriksaan } from '@/interfaces/pemeriksaan';
import { Pencil, Trash } from 'lucide-react';
import { deletePemeriksaanPasien } from '@/services/dokter/pemeriksaan-pasien-service';
import DeleteConfirmDialog from './DialogConfirm';

interface PemeriksaanTableProps {
   pemeriksaanList: Pemeriksaan[];
   fetchPemeriksaanPasien: () => void;
}

export default function PemeriksaanTable({ pemeriksaanList, fetchPemeriksaanPasien }: PemeriksaanTableProps) {
   const [deleteItem, setDeleteItem] = useState<Pemeriksaan | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   const handleDelete = async () => {
      if (!deleteItem) return;

      try {
         setIsDeleting(true);
         await deletePemeriksaanPasien(deleteItem.id);
         fetchPemeriksaanPasien(); // Refresh data setelah hapus
         setDeleteItem(null); // Reset delete item
      } catch (err) {
         console.error('Gagal menghapus pemeriksaan:', err);
      } finally {
         setIsDeleting(false);
      }
   };

   const handleEdit = (pemeriksaan: Pemeriksaan) => {
      // TODO: Implementasi edit pemeriksaan
      console.log('Edit pemeriksaan:', pemeriksaan);
   };

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
                     <TableCell colSpan={6} className="text-center text-gray-500">
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
                        <TableCell className='justify-center flex items-center gap-2'>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(pemeriksaan)}
                              className="p-2 bg-yellow-100 hover:bg-yellow-200 cursor-pointer"
                           >
                              <Pencil size={16} className='text-yellow-500' />
                           </Button>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteItem(pemeriksaan)}
                              className="p-2 bg-red-100 hover:bg-red-200 cursor-pointer"
                           >
                              <Trash size={16} className='text-red-500' />
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>

         <DeleteConfirmDialog
            isOpen={!!deleteItem}
            onClose={() => setDeleteItem(null)}
            onConfirm={handleDelete}
            title="Hapus Pemeriksaan"
            description={`Apakah Anda yakin ingin menghapus pemeriksaan untuk pasien ${deleteItem?.pasien.nama}? Tindakan ini tidak dapat dibatalkan.`}
            isLoading={isDeleting}
         />
      </div>
   );
}