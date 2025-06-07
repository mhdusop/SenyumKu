'use client';

import React, { useState } from 'react';
import { createPemeriksaanPasien } from '@/services/dokter/pemeriksaan-pasien-service';
import { Pendaftaran } from '@/interfaces/pendaftaran';
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

interface PemeriksaanFormProps {
   daftarPasien: Pendaftaran[];
   fetchPemeriksaanPasien: () => void;
}

export default function PemeriksaanForm({ daftarPasien, fetchPemeriksaanPasien }: PemeriksaanFormProps) {
   const [newPemeriksaan, setNewPemeriksaan] = useState({
      pasienId: 0,
      keluhan: '',
      diagnosa: '',
      catatanTambahan: '',
   });

   const handleCreate = async () => {
      try {
         await createPemeriksaanPasien({
            tanggal: new Date().toISOString(),
            pasienId: newPemeriksaan.pasienId,
            keluhan: newPemeriksaan.keluhan,
            diagnosa: newPemeriksaan.diagnosa,
            catatanTambahan: newPemeriksaan.catatanTambahan,
         });
         setNewPemeriksaan({ pasienId: 0, keluhan: '', diagnosa: '', catatanTambahan: '' });
         fetchPemeriksaanPasien();
      } catch (err) {
         console.error('Gagal membuat pemeriksaan:', err);
      }
   };

   const handlePasienChange = (value: string) => {
      const id = Number(value);
      const selectedPasien = daftarPasien.find((p) => p.pasienId === id);
      if (selectedPasien) {
         setNewPemeriksaan({
            ...newPemeriksaan,
            pasienId: id,
            keluhan: selectedPasien.keluhan,
         });
      } else {
         setNewPemeriksaan({ ...newPemeriksaan, pasienId: id, keluhan: '' });
      }
   };

   return (
      <div className="space-y-4">
         <h2 className="text-lg font-semibold">Tambah Pemeriksaan Baru</h2>
         <Select
            onValueChange={handlePasienChange}
         >
            <SelectTrigger className="w-[300px]">
               <SelectValue placeholder="Pilih Pasien" />
            </SelectTrigger>
            <SelectContent>
               <SelectGroup>
                  <SelectLabel>Pasien</SelectLabel>
                  {daftarPasien.map((pendaftaran) => (
                     <SelectItem key={pendaftaran.id} value={pendaftaran.pasienId.toString()}>
                        {pendaftaran.pasien.nama}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>
         <Input
            type='text'
            placeholder='Keluhan'
            value={newPemeriksaan.keluhan}
            onChange={(e) => setNewPemeriksaan({ ...newPemeriksaan, keluhan: e.target.value })}
            className='border rounded p-2 mr-2'
         />
         <Input
            type='text'
            placeholder='Diagnosa'
            value={newPemeriksaan.diagnosa}
            onChange={(e) => setNewPemeriksaan({ ...newPemeriksaan, diagnosa: e.target.value })}
            className='border rounded p-2 mr-2'
         />
         <Textarea
            placeholder='Catatan Tambahan'
            value={newPemeriksaan.catatanTambahan}
            onChange={(e) => setNewPemeriksaan({ ...newPemeriksaan, catatanTambahan: e.target.value })}
            className='border rounded p-2 mr-2'
         />
         <Button onClick={handleCreate} className='bg-blue-500 text-white rounded cursor-pointer'>
            Tambah
         </Button>
      </div>
   );
}