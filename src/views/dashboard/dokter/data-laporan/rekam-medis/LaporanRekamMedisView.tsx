"use client";

import { useState, useEffect } from "react";
import {
   fetchRekamMedisReport,
   exportRekamMedisReport,
   RekamMedisReport,
   RekamMedisReportFilters
} from "@/services/dokter/report-rekam-medis-service";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { showError, showLoading, dismissToast, showSuccess } from "@/utils/toast";
import Loader from "@/components/common/Loader";

// Import komponen
import { FilterRekamMedis } from "./components/FilterRekamMedis";
import { RingkasanRekamMedis } from "./components/RingkasanRekamMedis";
import { TabelRekamMedis } from "./components/TableRekamMedis";

export default function LaporanRekamMedisView() {
   const [report, setReport] = useState<RekamMedisReport | null>(null);
   const [loading, setLoading] = useState(true);
   const [filters, setFilters] = useState<RekamMedisReportFilters>({
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
   });

   const loadReport = async () => {
      const toastId = showLoading("Memuat data laporan...");
      setLoading(true);

      try {
         const data = await fetchRekamMedisReport(filters);
         setReport(data);
      } catch (error) {
         console.error(error);
         showError("Gagal memuat laporan rekam medis");
      } finally {
         dismissToast(toastId);
         setLoading(false);
      }
   };

   useEffect(() => {
      loadReport();
   }, []);

   const handleFilterChange = (key: keyof RekamMedisReportFilters, value: string | number | undefined) => {
      setFilters({ ...filters, [key]: value });
   };

   const handleExport = async () => {
      const toastId = showLoading("Mengekspor laporan...");
      try {
         await exportRekamMedisReport(filters);
         dismissToast(toastId);
         showSuccess("Laporan berhasil diekspor ke Excel");
      } catch (error) {
         console.error(error);
         dismissToast(toastId);
         showError("Gagal mengekspor laporan");
      }
   };

   if (loading) return <Loader />;

   return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Laporan Rekam Medis</h1>
            <Button
               onClick={handleExport}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={!report?.records.length}
            >
               <Download size={16} />
               Export Excel
            </Button>
         </div>

         {/* Filter komponen */}
         <FilterRekamMedis
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={loadReport}
         />

         {/* Ringkasan komponen */}
         {report && (
            <RingkasanRekamMedis
               totalRecords={report.totalRecords}
               topDiagnoses={report.topDiagnoses}
            />
         )}

         {/* Tabel rekam medis */}
         {report && <TabelRekamMedis records={report.records} />}
      </div>
   );
}