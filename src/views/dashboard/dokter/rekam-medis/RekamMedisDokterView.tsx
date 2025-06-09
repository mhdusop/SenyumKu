'use client';

import React, { useState, useEffect } from 'react';
import { RekamMedis } from '@/interfaces/rekam-medis';
import { getRekamMedisList, deleteRekamMedis, createRekamMedis } from '@/services/dokter/rekam-medis-service';
import { getAllPasien } from '@/services/pasien-service';
import RekamMedisTable from './components/RekamMedisTable';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ConfirmDialog from './components/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RekamMedisDokterView() {
   const [rekamMedisList, setRekamMedisList] = useState<RekamMedis[]>([]);
   const [loading, setLoading] = useState(true);
   const [deleteItem, setDeleteItem] = useState<RekamMedis | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formData, setFormData] = useState({
      pasienId: '',
      pemeriksaanId: '', // Optional
      isi: '',
      tanggal: '',
   });
   interface Pasien {
      id: number;
      nama: string;
   }
   const [pasienList, setPasienList] = useState<Pasien[]>([]); // State to hold pasien

   useEffect(() => {
      fetchRekamMedisList();
      fetchPasien(); // Fetch pasien on component mount
   }, []);

   const fetchRekamMedisList = async () => {
      try {
         setLoading(true);
         const data = await getRekamMedisList();
         setRekamMedisList(data);
      } catch (err) {
         console.error('Gagal mengambil data rekam medis:', err);
      } finally {
         setLoading(false);
      }
   };

   const fetchPasien = async () => {
      try {
         const res = await getAllPasien(); // Fetch pasien from the backend
         const data = res.data
         console.log('Data pasien:', data); // Log the data for debugging

         // Pastikan data adalah array
         if (Array.isArray(data)) {
            setPasienList(data);
         } else {
            console.error('Data pasien bukan array:', data);
            setPasienList([]); // Set to empty array if not an array
         }
      } catch (err) {
         console.error('Gagal mengambil data pasien:', err);
         setPasienList([]); // Set to empty array on error
      }
   };

   const handleDeleteClick = (rekamMedis: RekamMedis) => {
      setDeleteItem(rekamMedis);
   };

   const handleDeleteConfirm = async () => {
      if (!deleteItem) return;

      try {
         setIsDeleting(true);
         await deleteRekamMedis(deleteItem.id);
         fetchRekamMedisList();
         setDeleteItem(null);
      } catch (err) {
         console.error('Gagal menghapus rekam medis:', err);
         alert('Gagal menghapus rekam medis. Silakan coba lagi.');
      } finally {
         setIsDeleting(false);
      }
   };

   const handleDeleteCancel = () => {
      setDeleteItem(null);
   };

   const handleToggleForm = () => {
      setIsFormOpen(!isFormOpen);
      if (!isFormOpen) {
         // Reset form when opening
         setFormData({
            pasienId: '',
            pemeriksaanId: '',
            isi: '',
            tanggal: '',
         });
      }
   };

   const handleSubmit = async () => {
      // Validasi input
      if (!formData.pasienId || !formData.isi) {
         alert('Pasien dan Isi Rekam Medis harus diisi!');
         return;
      }

      try {
         setIsSubmitting(true);

         // Prepare payload
         const payload = {
            pasien: {
               id: parseInt(formData.pasienId)
            },
            isi: formData.isi,
            tanggal: formData.tanggal || new Date().toISOString().split('T')[0],
            ...(formData.pemeriksaanId && {
               pemeriksaanId: parseInt(formData.pemeriksaanId)
            }),
         };

         await createRekamMedis(payload);
         fetchRekamMedisList(); // Refresh data setelah berhasil
         setFormData({
            pasienId: '',
            pemeriksaanId: '',
            isi: '',
            tanggal: '',
         });
         setIsFormOpen(false); // Close the form after submission
         alert('Rekam medis berhasil dibuat!');
      } catch (err) {
         console.error('Gagal membuat rekam medis:', err);
         alert('Gagal membuat rekam medis. Silakan coba lagi.');
      } finally {
         setIsSubmitting(false);
      }
   };

   if (loading) {
      return <Loader />;
   }

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Rekam Medis</h1>
            <Button
               className="flex items-center gap-2"
               onClick={handleToggleForm}
               variant={isFormOpen ? "outline" : "default"}
            >
               <Plus size={16} />
               {isFormOpen ? 'Tutup Form' : 'Buat Rekam Medis'}
            </Button>
         </div>

         {isFormOpen && (
            <div className="bg-white p-6 rounded-lg shadow border">
               <h2 className="text-lg font-semibold mb-4">Form Rekam Medis Baru</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="pasienId" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Pasien <span className="text-red-500">*</span>
                     </label>
                     <Select
                        value={formData.pasienId}
                        onValueChange={(value) => setFormData({ ...formData, pasienId: value })}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Pilih Pasien" />
                        </SelectTrigger>
                        <SelectContent>
                           {Array.isArray(pasienList) && pasienList.length > 0 ? (
                              pasienList.map((pasien) => (
                                 <SelectItem key={pasien.id} value={pasien.id.toString()}>
                                    {pasien.nama}
                                 </SelectItem>
                              ))
                           ) : (
                              <SelectItem value="ALL" disabled>
                                 Tidak ada data pasien
                              </SelectItem>
                           )}
                        </SelectContent>
                     </Select>
                  </div>

                  <div>
                     <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
                        Tanggal
                     </label>
                     <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                     />
                  </div>

                  <div>
                     <label htmlFor="pemeriksaanId" className="block text-sm font-medium text-gray-700 mb-1">
                        ID Pemeriksaan (Opsional)
                     </label>
                     <Input
                        id="pemeriksaanId"
                        type="number"
                        placeholder="Masukkan ID Pemeriksaan"
                        value={formData.pemeriksaanId}
                        onChange={(e) => setFormData({ ...formData, pemeriksaanId: e.target.value })}
                     />
                  </div>

                  <div className="md:col-span-2">
                     <label htmlFor="isi" className="block text-sm font-medium text-gray-700 mb-1">
                        Isi Rekam Medis <span className="text-red-500">*</span>
                     </label>
                     <Textarea
                        id="isi"
                        placeholder="Masukkan isi rekam medis..."
                        value={formData.isi}
                        onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                        rows={4}
                        required
                     />
                  </div>
               </div>

               <div className="flex gap-2 mt-6">
                  <Button
                     onClick={handleSubmit}
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                  <Button
                     variant="outline"
                     onClick={handleToggleForm}
                     disabled={isSubmitting}
                  >
                     Batal
                  </Button>
               </div>
            </div>
         )}

         <RekamMedisTable rekamMedisList={rekamMedisList} onDelete={handleDeleteClick} />

         <ConfirmDialog
            isOpen={!!deleteItem}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Hapus Rekam Medis"
            description={`Apakah Anda yakin ingin menghapus rekam medis untuk pasien ${deleteItem?.pasien.nama}? Tindakan ini tidak dapat dibatalkan.`}
            isLoading={isDeleting}
         />
      </div>
   );
}