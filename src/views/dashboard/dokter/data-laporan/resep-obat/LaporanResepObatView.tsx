'use client';

import { useState, useEffect } from 'react';
import { fetchPrescriptionReport, exportPrescriptionReport, PrescriptionReport, PrescriptionReportFilters } from '@/services/dokter/report-resep-service';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { showError, showLoading, dismissToast } from '@/utils/toast';
import Loader from '@/components/common/Loader';

import { FilterLaporan } from './components/FilterLaporan';
import { RingkasanLaporan } from './components/RingkasanLaporan';
import { StatistikObat } from './components/StatistikObat';
import { DetailResep } from './components/DetailResep';

export default function LaporanObatView() {
   const [report, setReport] = useState<PrescriptionReport | null>(null);
   const [loading, setLoading] = useState(true);
   const [filters, setFilters] = useState<PrescriptionReportFilters>({
      startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
   });

   const loadReport = async () => {
      const toastId = showLoading('Memuat data laporan...');
      setLoading(true);

      try {
         const data = await fetchPrescriptionReport(filters);
         setReport(data);
      } catch (error) {
         console.error(error);
         showError('Gagal memuat laporan resep');
      } finally {
         dismissToast(toastId);
         setLoading(false);
      }
   };

   useEffect(() => {
      loadReport();
   }, []);

   const handleFilterChange = (key: keyof PrescriptionReportFilters, value: string | number) => {
      setFilters({ ...filters, [key]: value });
   };

   const handleExport = async () => {
      const toastId = showLoading('Mengekspor laporan...');
      try {
         await exportPrescriptionReport(filters);
         dismissToast(toastId);
      } catch (error) {
         console.error(error);
         dismissToast(toastId);
         showError('Gagal mengekspor laporan');
      }
   };

   if (loading) return <Loader />;

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Laporan Resep Obat</h1>
            <Button
               onClick={handleExport}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={!report?.prescriptions.length}
            >
               <Download size={16} />
               Export Excel
            </Button>
         </div>

         {/* Filter komponen */}
         <FilterLaporan
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={loadReport}
         />

         {/* Ringkasan komponen */}
         <RingkasanLaporan
            totalResep={report?.totalPrescriptions || 0}
         />

         {/* Statistik komponen */}
         {report?.statistics && (
            <StatistikObat
               statistics={report.statistics}
            />
         )}

         {/* Detail resep komponen */}
         <DetailResep
            prescriptions={report?.prescriptions || []}
         />
      </div>
   );
}