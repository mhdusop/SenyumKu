export interface PaymentReportFilters {
   startDate?: string;
   endDate?: string;
   pasienId?: number;
   metode?: string;
}

export interface PaymentReport {
   totalTransactions: number;
   totalAmount: number;
   payments: Array<{
      id: number;
      pasienNama: string;
      pasienId: number;
      jumlah: number;
      metode: string;
      tanggal: string;
      noTelp: string;
   }>;
   paymentMethodDistribution: Array<{
      metode: string;
      jumlahTotal: number;
      jumlahTransaksi: number;
   }>;
   dailySummary: Array<{
      date: string;
      count: number;
      total: number;
   }>;
}

export async function fetchPaymentReport(
   filters?: PaymentReportFilters
): Promise<PaymentReport> {
   const queryParams = new URLSearchParams();

   if (filters?.startDate) {
      queryParams.append("startDate", filters.startDate);
   }

   if (filters?.endDate) {
      queryParams.append("endDate", filters.endDate);
   }

   const url = `/api/dokter/laporan/pembayaran${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
   }`;

   const response = await fetch(url, {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (!response.ok) {
      throw new Error("Failed to fetch payment report");
   }

   return await response.json();
}

export async function exportPaymentReport(
   filters?: PaymentReportFilters
): Promise<void> {
   try {
      const report = await fetchPaymentReport(filters);

      const { exportToExcel, formatTableDataForExport } = await import(
         "@/utils/excel"
      );

      const paymentsData = formatTableDataForExport(
         report.payments,
         (item) => ({
            ID: item.id,
            "Nama Pasien": item.pasienNama,
            "Nomor Telepon": item.noTelp,
            "Jumlah (Rp)": item.jumlah,
            "Metode Pembayaran": item.metode,
            Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
         })
      );

      exportToExcel(paymentsData, "Laporan_Pembayaran", "Pembayaran");
   } catch (error) {
      console.error("Error exporting payment report:", error);
      throw error;
   }
}
