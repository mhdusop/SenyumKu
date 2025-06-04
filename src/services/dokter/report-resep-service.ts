export interface PrescriptionReportFilters {
   startDate?: string;
   endDate?: string;
   dokterId?: number;
   obatId?: number;
}

export interface PrescriptionReport {
   totalPrescriptions: number;
   prescriptions: Array<{
      id: number;
      dokter: string;
      spesialisasi: string;
      obat: string;
      jumlah: number;
      satuan: string;
      aturan: string;
      pasien: string;
      tanggal: string | null;
   }>;
   statistics: Array<{
      obatId: number;
      nama: string;
      jumlahTotal: number;
      satuan: string;
   }>;
}

export async function fetchPrescriptionReport(
   filters?: PrescriptionReportFilters
): Promise<PrescriptionReport> {
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

   if (filters?.obatId) {
      queryParams.append("obatId", filters.obatId.toString());
   }

   const url = `/api/dokter/laporan/resep${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
   }`;

   const response = await fetch(url, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (!response.ok) {
      throw new Error("Failed to fetch prescription report");
   }

   return await response.json();
}

export async function exportPrescriptionReport(
   filters?: PrescriptionReportFilters
): Promise<void> {
   try {
      const report = await fetchPrescriptionReport(filters);

      const { exportToExcel, formatTableDataForExport } = await import(
         "@/utils/excel"
      );

      const prescriptionsData = formatTableDataForExport(
         report.prescriptions,
         (item) => ({
            ID: item.id,
            Dokter: item.dokter,
            Spesialisasi: item.spesialisasi,
            Obat: item.obat,
            Jumlah: item.jumlah,
            Satuan: item.satuan,
            "Aturan Pakai": item.aturan,
            Pasien: item.pasien,
            Tanggal: item.tanggal
               ? new Date(item.tanggal).toLocaleDateString("id-ID")
               : "-",
         })
      );

      exportToExcel(prescriptionsData, "Laporan_Resep", "Resep");
   } catch (error) {
      console.error("Error exporting prescription report:", error);
      throw error;
   }
}
