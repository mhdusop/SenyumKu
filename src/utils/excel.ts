import * as XLSX from "xlsx";
import { showSuccess, showError } from "@/utils/toast";

export const exportToExcel = <T>(
   data: T[],
   filename: string = "Export",
   sheetName: string = "Sheet1"
): boolean => {
   try {
      if (!data || data.length === 0) {
         showError("Tidak ada data untuk diekspor");
         return false;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const currentDate = new Date().toISOString().slice(0, 10);
      const fullFilename = `${filename}_${currentDate}.xlsx`;

      XLSX.writeFile(workbook, fullFilename);

      showSuccess("Data berhasil diekspor ke Excel");
      return true;
   } catch (error) {
      console.error("Error exporting to Excel:", error);
      showError("Gagal mengekspor data ke Excel");
      return false;
   }
};

export const formatTableDataForExport = <T, R>(
   data: T[],
   mapper: (item: T, index: number) => R
): R[] => {
   return data.map((item, index) => mapper(item, index));
};
