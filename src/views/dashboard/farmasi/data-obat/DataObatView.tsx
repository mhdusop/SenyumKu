'use client';

import React, { useState, useEffect } from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { showSuccess, showError } from '@/utils/toast';
import { getDaftarObat, deleteObat, createObat, updateObat } from '@/services/farmasi/obat-service';
import { Obat } from '@/interfaces/obat';
import Loader from '@/components/common/Loader';
import { Pencil, Pill, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

export default function DataObatView() {
   const [obatList, setObatList] = useState<Obat[]>([]);
   const [loading, setLoading] = useState(false);
   const [showForm, setShowForm] = useState(false);
   const [newObat, setNewObat] = useState<{ id: number | null; nama: string; stok: number; satuan: string }>({ id: null, nama: '', stok: 0, satuan: '' });
   const [isDialogOpen, setIsDialogOpen] = useState(false); // State untuk dialog konfirmasi
   const [deleteObatId, setDeleteObatId] = useState<number | null>(null); // ID obat yang akan dihapus

   const fetchObat = async () => {
      try {
         setLoading(true);
         const response = await getDaftarObat();
         if (response) {
            setObatList(response);
         } else {
            showError(response || 'Gagal mengambil data obat.');
         }
      } catch (error) {
         console.error('Error fetching obat:', error);
         showError('Gagal mengambil data obat.');
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: number) => {
      try {
         await deleteObat(id);
         showSuccess('Data obat berhasil dihapus.');
         fetchObat(); // Refresh data
      } catch (error) {
         console.error('Error deleting obat:', error);
         showError('Gagal menghapus data obat.');
      }
   };

   const handleCreateOrUpdateObat = async () => {
      try {
         if (newObat.id) {
            await updateObat(newObat.id, { nama: newObat.nama, stok: newObat.stok, satuan: newObat.satuan });
            showSuccess('Data obat berhasil diperbarui.');
         } else {
            await createObat({ nama: newObat.nama, stok: newObat.stok, satuan: newObat.satuan });
            showSuccess('Data obat berhasil ditambahkan.');
         }
         setShowForm(false); // Sembunyikan form setelah berhasil
         resetForm(); // Reset form
         fetchObat(); // Refresh data
      } catch (error) {
         console.error('Error creating/updating obat:', error);
         showError('Gagal menambahkan atau memperbarui data obat.');
      }
   };

   const resetForm = () => {
      setNewObat({ id: null, nama: '', stok: 0, satuan: '' }); // Reset form
   };

   const handleEditObat = (obat: Obat) => {
      setNewObat(obat); // Isi form dengan data obat yang dipilih
      setShowForm(true); // Tampilkan form
   };

   const openDeleteDialog = (id: number) => {
      setDeleteObatId(id); // Simpan ID obat yang akan dihapus
      setIsDialogOpen(true); // Buka dialog
   };

   const confirmDelete = () => {
      if (deleteObatId !== null) {
         handleDelete(deleteObatId); // Hapus obat
         setIsDialogOpen(false); // Tutup dialog
         setDeleteObatId(null); // Reset ID obat
      }
   };

   useEffect(() => {
      fetchObat();
   }, []);

   if (loading) {
      return <Loader />;
   }

   return (
      <div className='space-y-4'>
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Data Obat</h1>
            <Button
               onClick={() => {
                  resetForm(); // Reset form saat tombol ditekan
                  setShowForm(!showForm); // Toggle form
               }}
               className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1 cursor-pointer"
            >
               <Pill />
               {showForm ? 'Tutup Form' : 'Buat Obat'}
            </Button>
         </div>

         {/* Form untuk membuat atau memperbarui obat */}
         {showForm && (
            <div className="bg-white p-4 rounded-lg shadow space-y-4">
               <h2 className="text-xl font-bold">{newObat.id ? 'Form Update Obat' : 'Form Buat Obat'}</h2>
               <div className="space-y-2">
                  <div>
                     <label className="block text-sm font-medium">Nama Obat</label>
                     <input
                        type="text"
                        value={newObat.nama}
                        onChange={(e) => setNewObat({ ...newObat, nama: e.target.value })}
                        className="w-full border rounded p-2"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium">Stok</label>
                     <input
                        type="number"
                        value={newObat.stok}
                        onChange={(e) => setNewObat({ ...newObat, stok: Number(e.target.value) })}
                        className="w-full border rounded p-2"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium">Satuan</label>
                     <input
                        type="text"
                        value={newObat.satuan}
                        onChange={(e) => setNewObat({ ...newObat, satuan: e.target.value })}
                        className="w-full border rounded p-2"
                     />
                  </div>
                  <Button
                     onClick={handleCreateOrUpdateObat}
                     className="bg-green-500 hover:bg-green-600 text-white"
                  >
                     {newObat.id ? 'Perbarui Obat' : 'Simpan Obat'}
                  </Button>
               </div>
            </div>
         )}

         <div className="bg-white p-4 rounded-lg shadow">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nama</TableHead>
                     <TableHead>Stok</TableHead>
                     <TableHead>Satuan</TableHead>
                     <TableHead className='text-center'>Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {obatList.length > 0 ? (
                     obatList.map((obat) => (
                        <TableRow key={obat.id}>
                           <TableCell>{obat.id}</TableCell>
                           <TableCell>{obat.nama}</TableCell>
                           <TableCell>{obat.stok}</TableCell>
                           <TableCell>{obat.satuan}</TableCell>
                           <TableCell className='flex justify-center gap-1'>
                              <button
                                 className='cursor-pointer'
                                 onClick={() => handleEditObat(obat)} // Panggil fungsi edit
                              >
                                 <Pencil className='text-yellow-500' size={17} />
                              </button>
                              <button
                                 className='cursor-pointer ml-2'
                                 onClick={() => openDeleteDialog(obat.id)} // Buka dialog konfirmasi
                              >
                                 <Trash className='text-red-500' size={17} />
                              </button>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                           Tidak ada data obat.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         {/* Dialog Konfirmasi Hapus */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
               <DialogTitle>Konfirmasi Hapus</DialogTitle>
               <DialogDescription>
                  Apakah Anda yakin ingin menghapus obat ini? Tindakan ini tidak dapat dibatalkan.
               </DialogDescription>
               <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                     <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Batal
                     </Button>
                  </DialogClose>
                  <Button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
                     Hapus
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}