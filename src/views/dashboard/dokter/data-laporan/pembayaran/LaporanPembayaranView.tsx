'use client';

import { useState, useEffect } from 'react';
import {
   fetchPaymentReport,
   exportPaymentReport,
   PaymentReport,
   PaymentReportFilters
} from '@/services/dokter/report-pembayaran-service';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { showError, showLoading, dismissToast } from '@/utils/toast';
import Loader from '@/components/common/Loader';

import { FilterPembayaran } from './components/FilterPembayaran';
import { RingkasanPembayaran } from './components/RingkasanPembayaran';
import { DistribusiMetodePembayaran } from './components/DistribusiMetodePembayaran';
import { DetailPembayaran } from './components/DetailPembayaran';

export default function LaporanPembayaranView() {
   const [report, setReport] = useState<PaymentReport | null>(null);
   const [loading, setLoading] = useState(true);
   const [filters, setFilters] = useState<PaymentReportFilters>({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
   });

   const loadReport = async () => {
      const toastId = showLoading('Memuat data laporan...');
      setLoading(true);

      try {
         const data = await fetchPaymentReport(filters);
         setReport(data);
      } catch (error) {
         console.error(error);
         showError('Gagal memuat laporan pembayaran');
      } finally {
         dismissToast(toastId);
         setLoading(false);
      }
   };

   useEffect(() => {
      loadReport();
   }, []);

   const handleFilterChange = (key: keyof PaymentReportFilters, value: string | number) => {
      setFilters({ ...filters, [key]: value });
   };

   const handleExport = async () => {
      const toastId = showLoading('Mengekspor laporan...');
      try {
         await exportPaymentReport(filters);
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
            <h1 className="text-2xl font-bold">Laporan Pembayaran</h1>
            <Button
               onClick={handleExport}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={!report?.payments.length}
            >
               <Download size={16} />
               Export Excel
            </Button>
         </div>

         {/* Filter komponen */}
         <FilterPembayaran
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={loadReport}
         />

         {/* Ringkasan komponen */}
         <RingkasanPembayaran
            totalTransaksi={report?.totalTransactions || 0}
            totalJumlah={report?.totalAmount || 0}
         />

         {/* Distribusi metode pembayaran */}
         {report?.paymentMethodDistribution && (
            <DistribusiMetodePembayaran
               distribusi={report.paymentMethodDistribution}
            />
         )}

         {/* Detail pembayaran komponen */}
         <DetailPembayaran
            pembayaran={report?.payments || []}
         />

         {report?.payments.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-center">
               Tidak ada data pembayaran dalam rentang tanggal yang dipilih.
               Coba ubah filter tanggal untuk melihat lebih banyak data.
            </div>
         )}
      </div >
   );
}