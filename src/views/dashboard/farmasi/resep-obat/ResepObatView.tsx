/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { getResepList, getResepDetail, processResep } from '@/services/farmasi/resep-service';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import Loader from '@/components/common/Loader';
import TabelResep from './components/TableResep';
import DetailResep from './components/DetailResep';
import ProsesResepDialog from './components/ResepDialog';

export default function ResepObatView() {
   const [resepList, setResepList] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedResep, setSelectedResep] = useState<any | null>(null);
   const [detailOpen, setDetailOpen] = useState(false);
   const [prosesOpen, setProsesOpen] = useState(false);

   const loadResepList = async () => {
      const loadingToast = showLoading('Memuat data resep...');
      setLoading(true);
      try {
         const data = await getResepList();
         setResepList(data);
      } catch (error) {
         console.error(error);
         showError('Gagal memuat data resep');
      } finally {
         dismissToast(loadingToast);
         setLoading(false);
      }
   };

   useEffect(() => {
      loadResepList();
   }, []);

   const handleViewDetail = async (id: number) => {
      try {
         const data = await getResepDetail(id);
         setSelectedResep(data);
         setDetailOpen(true);
      } catch (error) {
         console.error(error);
         showError('Gagal memuat detail resep');
      }
   };

   const handleOpenProsesDialog = async (id: number) => {
      try {
         const data = await getResepDetail(id);
         setSelectedResep(data);
         setProsesOpen(true);
      } catch (error) {
         console.error(error);
         showError('Gagal memuat detail resep');
      }
   };

   const handleProsesResep = async (data: any) => {
      if (!selectedResep) return;

      const loadingToast = showLoading('Memproses resep...');
      try {
         await processResep(selectedResep.id, data);
         showSuccess('Resep berhasil diproses');
         await loadResepList(); // Refresh data
         setProsesOpen(false);
      } catch (error) {
         console.error(error);
         showError('Gagal memproses resep');
      } finally {
         dismissToast(loadingToast);
      }
   };

   if (loading && resepList.length === 0) return <Loader />;

   return (
      <div className="space-y-4">
         <h1 className="text-2xl font-bold">Resep Obat</h1>

         <TabelResep
            resepList={resepList}
            onViewDetail={handleViewDetail}
            onProcessResep={handleOpenProsesDialog}
         />

         <DetailResep
            open={detailOpen}
            onOpenChange={setDetailOpen}
            resep={selectedResep}
            onProcessResep={() => {
               setDetailOpen(false);
               setProsesOpen(true);
            }}
         />

         <ProsesResepDialog
            open={prosesOpen}
            onOpenChange={setProsesOpen}
            currentStatus={selectedResep?.status || 'BARU'}
            onSubmit={handleProsesResep}
            id={selectedResep?.id || 0}
         />
      </div>
   );
}