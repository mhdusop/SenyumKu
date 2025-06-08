'use client';

import React, { useState, useEffect } from 'react';
import { createPemeriksaanPasien, updatePemeriksaanPasien } from '@/services/dokter/pemeriksaan-pasien-service';
import { Pendaftaran } from '@/interfaces/pendaftaran';
import { Pemeriksaan } from '@/interfaces/pemeriksaan';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PemeriksaanFormProps {
   daftarPasien: Pendaftaran[];
   fetchPemeriksaanPasien: () => void;
   editData?: Pemeriksaan | null;
   onCancelEdit?: () => void;
   onSuccess?: () => void;
}

export default function PemeriksaanForm({
   daftarPasien,
   fetchPemeriksaanPasien,
   editData,
   onCancelEdit,
   onSuccess,
}: PemeriksaanFormProps) {
   const [formData, setFormData] = useState({
      pasienId: 0,
      keluhan: '',
      diagnosa: '',
      catatanTambahan: '',
   });

   const [isSubmitting, setIsSubmitting] = useState(false);

   const resetForm = () => {
      setFormData({
         pasienId: 0,
         keluhan: '',
         diagnosa: '',
         catatanTambahan: '',
      });
   };

   useEffect(() => {
      if (editData) {
         setFormData({
            pasienId: editData.pasienId,
            keluhan: editData.keluhan,
            diagnosa: editData.diagnosa,
            catatanTambahan: editData.catatanTambahan || '',
         });
      } else {
         resetForm();
      }
   }, [editData]);

   const handlePasienChange = (value: string) => {
      const id = Number(value);
      const selectedPasien = daftarPasien.find((p) => p.pasienId === id);
      if (selectedPasien) {
         setFormData({
            ...formData,
            pasienId: id,
            keluhan: selectedPasien.keluhan,
         });
      } else {
         setFormData({ ...formData, pasienId: id, keluhan: '' });
      }
   };

   const handleSubmit = async () => {
      if (!formData.pasienId || !formData.keluhan || !formData.diagnosa) {
         alert('Mohon lengkapi semua field yang wajib diisi');
         return;
      }

      try {
         setIsSubmitting(true);

         if (editData) {
            await updatePemeriksaanPasien({
               id: editData.id,
               keluhan: formData.keluhan,
               diagnosa: formData.diagnosa,
               catatanTambahan: formData.catatanTambahan,
            });
         } else {
            await createPemeriksaanPasien({
               tanggal: new Date().toISOString(),
               pasienId: formData.pasienId,
               keluhan: formData.keluhan,
               diagnosa: formData.diagnosa,
               catatanTambahan: formData.catatanTambahan,
            });
         }

         fetchPemeriksaanPasien();
         resetForm();

         if (onSuccess) {
            onSuccess();
         }
      } catch (err) {
         console.error('Gagal menyimpan pemeriksaan:', err);
         alert('Gagal menyimpan pemeriksaan. Silakan coba lagi.');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleCancel = () => {
      resetForm();
      if (onCancelEdit) {
         onCancelEdit();
      }
   };

   return (
      <div className="space-y-4">
         <h2 className="text-lg font-semibold">
            {editData ? 'Edit Pemeriksaan' : 'Tambah Pemeriksaan Baru'}
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="pasien">Pasien *</Label>
               <Select
                  value={formData.pasienId.toString()}
                  onValueChange={handlePasienChange}
                  disabled={!!editData || isSubmitting}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Pilih Pasien" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Daftar Pasien</SelectLabel>
                        {daftarPasien.map((pendaftaran) => (
                           <SelectItem key={pendaftaran.id} value={pendaftaran.pasienId.toString()}>
                              {pendaftaran.pasien.nama}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>

            <div className="space-y-2">
               <Label htmlFor="keluhan">Keluhan *</Label>
               <Input
                  id="keluhan"
                  type="text"
                  placeholder="Masukkan keluhan pasien"
                  value={formData.keluhan}
                  onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
                  disabled={isSubmitting}
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="diagnosa">Diagnosa *</Label>
               <Input
                  id="diagnosa"
                  type="text"
                  placeholder="Masukkan diagnosa"
                  value={formData.diagnosa}
                  onChange={(e) => setFormData({ ...formData, diagnosa: e.target.value })}
                  disabled={isSubmitting}
               />
            </div>

            <div className="space-y-2">
               <Label htmlFor="catatan">Catatan Tambahan</Label>
               <Textarea
                  id="catatan"
                  placeholder="Masukkan catatan tambahan (opsional)"
                  value={formData.catatanTambahan}
                  onChange={(e) => setFormData({ ...formData, catatanTambahan: e.target.value })}
                  disabled={isSubmitting}
                  rows={3}
               />
            </div>
         </div>

         <div className="flex gap-2 pt-4">
            <Button
               onClick={handleSubmit}
               disabled={isSubmitting}
               className="bg-blue-500 hover:bg-blue-600 text-white"
            >
               {isSubmitting ? 'Menyimpan...' : (editData ? 'Simpan Perubahan' : 'Tambah Pemeriksaan')}
            </Button>

            <Button
               onClick={handleCancel}
               variant="outline"
               disabled={isSubmitting}
            >
               Batal
            </Button>
         </div>
      </div>
   );
}