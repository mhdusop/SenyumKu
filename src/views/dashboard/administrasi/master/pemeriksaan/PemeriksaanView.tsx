"use client"

import { useEffect, useState } from 'react'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { getAllPemeriksaan } from '@/services/pemeriksaan-service'
import Loader from '@/components/common/Loader'
import { Pemeriksaan } from '@/interfaces/pemeriksaan'
import { dateFormat } from '@/utils/date-format'
import { exportToExcel, formatTableDataForExport } from '@/utils/excel'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export default function PemeriksaanView() {
   const [dataPemeriksaan, setDataPemeriksaan] = useState<Pemeriksaan[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPemeriksaan = async () => {
         try {
            const res = await getAllPemeriksaan();
            setDataPemeriksaan(res.data);
         } catch (error) {
            console.error("Gagal mengambil data pemeriksaan:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchPemeriksaan();
   }, []);

   const handleExportExcel = () => {
      const exportData = formatTableDataForExport(dataPemeriksaan, (item, index) => ({
         'No': index + 1,
         'Nama Pasien': item.pasien.nama,
         'Nama Dokter': item.dokter.nama,
         'Tanggal Pemeriksaan': item.tanggal,
         'Diagnosa': item.diagnosa,
         'Catatan Tambahan': item.catatanTambahan,
      }));

      exportToExcel(exportData, 'Data_Pemeriksaan', 'Pemeriksaan');
   }

   if (loading) {
      return <Loader />
   }

   return (
      <div className='space-y-2'>
         <div className='flex justify-end bg-white rounded-lg shadow p-2 gap-2'>
            <Button
               onClick={handleExportExcel}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={dataPemeriksaan.length === 0}
            >
               <Download size={16} />
               Export Excel
            </Button>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>No</TableHead>
                     <TableHead>Nama Pasien</TableHead>
                     <TableHead>Nama Dokter</TableHead>
                     <TableHead>Tanggal Pemeriksaan</TableHead>
                     <TableHead>Diagnosa</TableHead>
                     <TableHead>Catatan Tambahan</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {dataPemeriksaan.map((data, index) => (
                     (dataPemeriksaan.length === 0 ? (
                        <TableRow key={data.id}>
                           <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                        </TableRow>
                     ) : (
                        <TableRow key={data.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{data.pasien.nama}</TableCell>
                           <TableCell>{data.dokter.nama}</TableCell>
                           <TableCell>{dateFormat(data.tanggal)}</TableCell>
                           <TableCell>{data.diagnosa}</TableCell>
                           <TableCell>{data.catatanTambahan}</TableCell>
                        </TableRow>
                     ))
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}