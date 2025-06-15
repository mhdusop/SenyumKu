'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { createResepObat } from '@/services/dokter/resep-obat-service';
import { getDaftarObat } from '@/services/farmasi/obat-service';
import { Obat } from '@/interfaces/obat';
import { useSession } from 'next-auth/react';
import { showError, showSuccess } from '@/utils/toast';

export default function ResepObatDokterView() {
   const router = useRouter();
   const { data: session } = useSession(); // Ambil session dokter yang login

   // State untuk form
   const [form, setForm] = useState({
      dokterId: session?.user?.dokterId || '', // Ambil ID dokter dari session
      obatId: '',
      jumlah: '',
      aturan: '',
      rekamMedisId: null, // Bisa null
   });

   const [loading, setLoading] = useState(false);
   const [daftarObat, setDaftarObat] = useState<Obat[]>([]);

   // Fetch daftar obat saat komponen dimuat
   useEffect(() => {
      const fetchDaftarObat = async () => {
         try {
            const response = await getDaftarObat();
            setDaftarObat(response);
         } catch (error) {
            console.error('Error fetching daftar obat:', error);
         }
      };

      fetchDaftarObat();
   }, []);

   // Handle perubahan input
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
   };

   // Handle perubahan select obat
   const handleSelectChange = (value: string) => {
      setForm((prev) => ({ ...prev, obatId: value }));
   };

   // Handle submit form
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         // Panggil API untuk membuat resep obat
         await createResepObat({
            dokterId: form.dokterId,
            obatId: form.obatId,
            jumlah: form.jumlah,
            aturan: form.aturan,
            rekamMedisId: form.rekamMedisId, // Kirim null jika tidak ada
         });
         showSuccess('Resep obat berhasil dibuat!');
         router.push('/dashboard/dokter'); // Redirect ke dashboard dokter
      } catch (error) {
         console.error('Error creating resep obat:', error);
         showError('Gagal membuat resep obat. Silakan coba lagi.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
         <h1 className="text-2xl font-bold mb-4">Buat Resep Obat</h1>
         <form onSubmit={handleSubmit} className="space-y-4">

            {/* Select Obat */}
            <div>
               <label htmlFor="obatId" className="block text-sm font-medium text-gray-700">
                  Pilih Obat
               </label>
               <Select
                  name="obatId"
                  value={form.obatId}
                  onValueChange={handleSelectChange}
                  required
               >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder="Pilih obat..." />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Daftar Obat</SelectLabel>
                        {daftarObat.map((obat) => (
                           <SelectItem key={obat.id} value={obat.id.toString()}>
                              {obat.nama} (Stok: {obat.stok})
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>

            {/* Jumlah */}
            <div>
               <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700">
                  Jumlah
               </label>
               <Input
                  id="jumlah"
                  name="jumlah"
                  type="number"
                  placeholder="Masukkan jumlah obat"
                  value={form.jumlah}
                  onChange={handleChange}
                  required
               />
            </div>

            {/* Aturan Pakai */}
            <div>
               <label htmlFor="aturan" className="block text-sm font-medium text-gray-700">
                  Aturan Pakai
               </label>
               <Textarea
                  id="aturan"
                  name="aturan"
                  placeholder="Masukkan aturan pakai obat"
                  value={form.aturan}
                  onChange={handleChange}
                  required
               />
            </div>

            {/* Submit Button */}
            <div>
               <Button type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Buat Resep'}
               </Button>
            </div>
         </form>
      </div>
   );
}