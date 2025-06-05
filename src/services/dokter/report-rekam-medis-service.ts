export interface RekamMedisReportFilters {
   startDate?: string;
   endDate?: string;
   dokterId?: number;
   pasienId?: number;
}

export interface RekamMedisRecord {
   id: number;
   pasienId: number;
   pasienNama: string;
   pasienTelp: string;
   dokterId: number;
   dokterNama: string;
   spesialisasi: string;
   keluhan: string;
   diagnosa: string;
   catatanTambahan: string;
   tanggal: string;
   isi: string;
}

export interface DiagnosisStatistic {
   diagnosa: string;
   jumlahKasus: number;
}

export interface RekamMedisReport {
   totalRecords: number;
   records: RekamMedisRecord[];
   topDiagnoses: DiagnosisStatistic[];
}

export async function fetchRekamMedisReport(
   filters?: RekamMedisReportFilters
): Promise<RekamMedisReport> {
   const queryParams = new URLSearchParams();

   if (filters?.startDate) {
      queryParams.append("startDate", filters.startDate);
   }

   if (filters?.endDate) {
      queryParams.append("endDate", filters.endDate);
   }

   if (filters?.dokterId) {
      queryParams.append("dokterId", filters.dokterId.toString());
   }

   if (filters?.pasienId) {
      queryParams.append("pasienId", filters.pasienId.toString());
   }

   // Create URL with query parameters
   const url = `/api/dokter/laporan/rekam-medis${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
   }`;

   // Fetch data from API
   const response = await fetch(url, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (!response.ok) {
      throw new Error("Failed to fetch rekam medis report");
   }

   return await response.json();
}

export async function exportRekamMedisReport(
   filters?: RekamMedisReportFilters
): Promise<void> {
   try {
      const report = await fetchRekamMedisReport(filters);
      const { exportToExcel, formatTableDataForExport } = await import(
         "@/utils/excel"
      );

      const exportData = formatTableDataForExport(report.records, (record) => ({
         ID: record.id,
         Pasien: record.pasienNama,
         "No. Telepon": record.pasienTelp,
         Dokter: record.dokterNama,
         Spesialisasi: record.spesialisasi,
         Keluhan: record.keluhan,
         Diagnosa: record.diagnosa,
         Tanggal: new Date(record.tanggal).toLocaleDateString("id-ID"),
         "Catatan Tambahan": record.catatanTambahan,
      }));

      // Export to Excel
      exportToExcel(exportData, "Laporan_Rekam_Medis", "Rekam Medis");
   } catch (error) {
      console.error("Error exporting rekam medis report:", error);
      throw error;
   }
}
