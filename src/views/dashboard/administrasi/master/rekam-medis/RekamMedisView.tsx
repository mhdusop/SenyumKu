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
import { getAllRekamMedis } from '@/services/rekam-medis-service'
import Loader from '@/components/common/Loader'
import { dateFormat } from '@/utils/date-format'
import { RekamMedis } from '@/interfaces/rekam-medis'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportToExcel, formatTableDataForExport } from '@/utils/excel'

export default function RekamMedisView() {
   const [dataRm, setDataRm] = useState<RekamMedis[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchRm = async () => {
         try {
            const res = await getAllRekamMedis();
            setDataRm(res.data);
         } catch (error) {
            console.error("Gagal mengambil data rekam medis:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchRm();
   }, []);

   const handleExportExcel = () => {
      const exportData = formatTableDataForExport(dataRm, (item, index) => ({
         'No': index + 1,
         'Nama Dokter': item.dokter.nama,
         'Nama Pasien': item.pasien.nama,
         'Tanggal': item.tanggal,
         'Catatan': item.isi,
      }));

      exportToExcel(exportData, 'Data_Rekam_Medis', 'Rekam Medis');
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
               disabled={dataRm.length === 0}
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
                     <TableHead>Nama Dokter</TableHead>
                     <TableHead>Nama Pasien</TableHead>
                     <TableHead>Tanggal</TableHead>
                     <TableHead>Catatan</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {dataRm.map((data, index) => (
                     (dataRm.length === 0 ? (
                        <TableRow key={data.id}>
                           <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                        </TableRow>
                     ) : (
                        <TableRow key={data.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{data.dokter.nama}</TableCell>
                           <TableCell>{data.pasien.nama}</TableCell>
                           <TableCell>{dateFormat(data.tanggal)}</TableCell>
                           <TableCell>{data.isi}</TableCell>
                        </TableRow>
                     ))
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}