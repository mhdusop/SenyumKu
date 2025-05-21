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
import { getAllPembayaran } from '@/services/pembayaran-service'
import Loader from '@/components/common/Loader'
import { dateFormat } from '@/utils/date-format'
import { Pembayaran } from '@/interfaces/pembayaran'

export default function PembayaranView() {
   const [dataPembayaran, setDataPembayaran] = useState<Pembayaran[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPembayaran = async () => {
         try {
            const res = await getAllPembayaran();
            setDataPembayaran(res.data);
         } catch (error) {
            console.error("Gagal mengambil data pembayaran:", error);
         } finally {
            setLoading(false);
         }
      };

      fetchPembayaran();
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
               <TableHead>Jumlah Bayar</TableHead>
               <TableHead>Tanggal Bayar</TableHead>
               <TableHead>Metode Pembayaran</TableHead>
               <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {dataPembayaran.map((data, index) => (
               (dataPembayaran.length === 0 ? (
                  <TableRow key={data.id}>
                     <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                  </TableRow>
               ) : (
                  <TableRow key={data.id}>
                     <TableCell>{index + 1}</TableCell>
                     <TableCell>{data.pasien.nama}</TableCell>
                     <TableCell>{data.jumlah}</TableCell>
                     <TableCell>{dateFormat(data.tanggal)}</TableCell>
                     <TableCell>{data.metode}</TableCell>
                     <TableCell className='text-center'>-</TableCell>
                  </TableRow>
               ))
            ))}
         </TableBody>
      </Table>
   );
}