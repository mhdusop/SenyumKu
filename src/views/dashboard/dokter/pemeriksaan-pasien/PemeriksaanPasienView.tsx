'use client';

import React, { useState } from 'react';
import PemeriksaanTable from './components/PemeriksaanTable';
import PemeriksaanForm from './components/PemeriksaanForm';
import { usePemeriksaan } from './hooks/usePemeriksaan';
import { usePasien } from './hooks/useDaftarPasien';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PemeriksaanPasienView() {
   const { pemeriksaanList, loading: loadingPemeriksaan, fetchPemeriksaanPasien } = usePemeriksaan();
   const { daftarPasien, loading: loadingPasien } = usePasien();
   const [showForm, setShowForm] = useState(false);

   const toggleForm = () => {
      setShowForm((prev) => !prev);
   };

   if (loadingPemeriksaan || loadingPasien) {
      return <Loader />;
   }

   return (
      <div className="space-y-4">
         <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">Daftar Pemeriksaan Pasien</h1>
            <Button className='flex items-center gap-2' onClick={toggleForm}>
               <Plus size={16} />
               Buat Pemeriksaan
            </Button>
         </div>
         {showForm && (
            <div className='bg-white p-4'>
               <PemeriksaanForm
                  daftarPasien={daftarPasien}
                  fetchPemeriksaanPasien={fetchPemeriksaanPasien}
               />
            </div>
         )}
         <PemeriksaanTable
            pemeriksaanList={pemeriksaanList}
            fetchPemeriksaanPasien={fetchPemeriksaanPasien}
         />
      </div>
   );
}