'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

// Interface untuk RekamMedis
interface RekamMedis {
   id: number;
   pasienId: number;
   dokterId: number;
   pemeriksaanId?: number | undefined;
   isi: string;
   tanggal: string;
}

// Interface untuk Pasien
interface Pasien {
   id: number;
   nama: string;
}

// Interface untuk Pemeriksaan
interface Pemeriksaan {
   id: number;
   nama: string; // Ganti dengan field yang sesuai
}

// Props untuk RekamMedisForm
interface RekamMedisFormProps {
   editData?: RekamMedis | null; // Data untuk edit (opsional)
   onSave: (data: Omit<RekamMedis, 'id' | 'pasien' | 'dokter' | 'resep'>) => void; // Fungsi untuk menyimpan data
   onCancel: () => void; // Fungsi untuk membatalkan
   pasienList: Pasien[]; // Daftar pasien untuk dropdown
   pemeriksaanList: Pemeriksaan[]; // Daftar pemeriksaan untuk dropdown
}

export default function RekamMedisForm({ editData, onSave, onCancel, pasienList, pemeriksaanList }: RekamMedisFormProps) {
   const [formData, setFormData] = useState<Omit<RekamMedis, 'id' | 'pasien' | 'dokter' | 'resep'>>({
      pasienId: 0,
      dokterId: 0,
      pemeriksaanId: 0, // Set pemeriksaanId ke 0 sebagai default
      isi: '',
      tanggal: new Date().toISOString(),
   });
   useEffect(() => {
      if (editData) {
         setFormData({
            pasienId: editData.pasienId,
            dokterId: editData.dokterId,
            pemeriksaanId: editData.pemeriksaanId || 0, // Ambil pemeriksaanId dari editData
            isi: editData.isi,
            tanggal: editData.tanggal,
         });
      } else {
         resetForm();
      }
   }, [editData]);
   const resetForm = () => {
      setFormData({
         pasienId: 0,
         dokterId: 0,
         pemeriksaanId: 0,
         isi: '',
         tanggal: new Date().toISOString(),
      });
   };

   const handleSubmit = () => {
      if (!formData.isi || !formData.tanggal || formData.pasienId === 0 || formData.pemeriksaanId === 0) {
         onSave(formData); // dokterId sudah ada di formData
         return;
      }
      onSave({ ...formData, dokterId: 0 }); // Menyertakan dokterId sebagai 0, karena akan diatur di API
   };

   const handleCancel = () => {
      resetForm();
      onCancel();
   };

   return (
      <div className="space-y-4">
         <h2 className="text-lg font-semibold">
            {editData ? 'Edit Rekam Medis' : 'Buat Rekam Medis Baru'}
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="pasien">Nama Pasien</Label>
               <Select
                  value={formData.pasienId.toString()}
                  onValueChange={(value) => setFormData({ ...formData, pasienId: Number(value) })}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Pilih Pasien" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Daftar Pasien</SelectLabel>
                        {pasienList.map((pasien) => (
                           <SelectItem key={pasien.id} value={pasien.id.toString()}>
                              {pasien.nama}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="pemeriksaan">Pemeriksaan</Label>
               <Select
                  value={(formData.pemeriksaanId ?? 0).toString()}
                  onValueChange={(value) => setFormData({ ...formData, pemeriksaanId: Number(value) })}
               >
                  <SelectTrigger>
                     <SelectValue placeholder="Pilih Pemeriksaan" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Daftar Pemeriksaan</SelectLabel>
                        {pemeriksaanList.map((pemeriksaan) => (
                           <SelectItem key={pemeriksaan.id} value={pemeriksaan.id.toString()}>
                              {pemeriksaan.nama} {/* Ganti dengan nama pemeriksaan yang sesuai */}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label htmlFor="tanggal">Tanggal Kunjungan</Label>
               <Input
                  id="tanggal"
                  type="date"
                  value={new Date(formData.tanggal).toISOString().slice(0, 10)}
                  onChange={(e) => setFormData({ ...formData, tanggal: new Date(e.target.value).toISOString() })}
               />
            </div>
            <div className="space-y-2 col-span-2">
               <Label htmlFor="isi">Isi Rekam Medis</Label>
               <Textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  rows={4}
                  placeholder="Masukkan isi rekam medis..."
               />
            </div>
         </div>
         <div className="flex justify-end gap-2">
            <Button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white">
               {editData ? 'Simpan Perubahan' : 'Simpan Rekam Medis'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
               Batal
            </Button>
         </div>
      </div>
   );
}