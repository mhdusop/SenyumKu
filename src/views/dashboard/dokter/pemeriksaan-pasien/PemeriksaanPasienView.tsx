'use client';

import React, { useState } from 'react';
import PemeriksaanTable from './components/PemeriksaanTable';
import PemeriksaanForm from './components/PemeriksaanForm';
import { usePemeriksaan } from './hooks/usePemeriksaan';
import { usePasien } from './hooks/useDaftarPasien';
import Loader from '@/components/common/Loader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Pemeriksaan } from '@/interfaces/pemeriksaan';
import { deletePemeriksaanPasien } from '@/services/dokter/pemeriksaan-pasien-service';
import DeleteConfirmDialog from './components/DialogConfirm';

export default function PemeriksaanPasienView() {
   const { pemeriksaanList, loading: loadingPemeriksaan, fetchPemeriksaanPasien } = usePemeriksaan();
   const { daftarPasien, loading: loadingPasien } = usePasien();
   const [showForm, setShowForm] = useState(false);
   const [editData, setEditData] = useState<Pemeriksaan | null>(null);
   const [deleteItem, setDeleteItem] = useState<Pemeriksaan | null>(null);
   const [isDeleting, setIsDeleting] = useState(false);

   const toggleForm = () => {
      setShowForm((prev) => !prev);
      if (showForm) {
         setEditData(null);
      }
   };

   const handleEdit = (pemeriksaan: Pemeriksaan) => {
      setEditData(pemeriksaan);
      setShowForm(true);
   };

   const handleCancelEdit = () => {
      setEditData(null);
      setShowForm(false);
   };

   const handleSuccess = () => {
      setEditData(null);
      setShowForm(false);
   };

   const handleDeleteClick = (pemeriksaan: Pemeriksaan) => {
      setDeleteItem(pemeriksaan);
   };

   const handleDeleteConfirm = async () => {
      if (!deleteItem) return;

      try {
         setIsDeleting(true);
         await deletePemeriksaanPasien(deleteItem.id);
         fetchPemeriksaanPasien();
         setDeleteItem(null);
      } catch (err) {
         console.error('Gagal menghapus pemeriksaan:', err);
         alert('Gagal menghapus pemeriksaan. Silakan coba lagi.');
      } finally {
         setIsDeleting(false);
      }
   };

   const handleDeleteCancel = () => {
      setDeleteItem(null);
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
               {showForm && !editData ? 'Sembunyikan Form' : 'Buat Pemeriksaan'}
            </Button>
         </div>
         {showForm && (
            <div className='bg-white p-4 rounded-lg shadow'>
               <PemeriksaanForm
                  daftarPasien={daftarPasien}
                  fetchPemeriksaanPasien={fetchPemeriksaanPasien}
                  editData={editData}
                  onCancelEdit={handleCancelEdit}
                  onSuccess={handleSuccess}
               />
            </div>
         )}
         <PemeriksaanTable
            pemeriksaanList={pemeriksaanList}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
         />

         <DeleteConfirmDialog
            isOpen={!!deleteItem}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="Hapus Pemeriksaan"
            description={`Apakah Anda yakin ingin menghapus pemeriksaan untuk pasien ${deleteItem?.pasien.nama}? Tindakan ini tidak dapat dibatalkan.`}
            isLoading={isDeleting}
         />
      </div>
   );
}