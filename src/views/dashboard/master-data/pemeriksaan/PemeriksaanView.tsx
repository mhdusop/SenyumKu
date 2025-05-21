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

export default function PemeriksaanView() {
   const [dataPemeriksaan, setDataPemeriksaan] = useState<Pemeriksaan[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPasien = async () => {
         try {
            const res = await getAllPemeriksaan();
            setDataPemeriksaan(res.data);
         } catch (error) {
            console.error("Gagal mengambil data pemeriksaan:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchPasien();
   }, []);

   if (loading) {
      return <Loader />
   }

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>No</TableHead>
               <TableHead>Nama Pasien</TableHead>
               <TableHead>Nama Dokter</TableHead>
               <TableHead>Tanggal Pemeriksaan</TableHead>
               <TableHead>Diagnosa</TableHead>
               <TableHead>Catatan Tambahan</TableHead>
               <TableHead className="text-center">Aksi</TableHead>
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
                     <TableCell className='text-center'>-</TableCell>
                  </TableRow>
               ))
            ))}
         </TableBody>
      </Table>
   );
}