"use client"

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Pembayaran } from "@/interfaces/pembayaran";
import { dateFormat } from "@/utils/date-format"

interface TableProps {
   pembayaran: Pembayaran[];
   isLoading: boolean;
}

export function TablePembayaranPasien({ pembayaran, isLoading }: TableProps) {
   return (
      <div className="bg-white rounded-lg shadow p-4">
         <h2 className="font-semibold text-lg mb-2">Riwayat Pembayaran</h2>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[40px]">No</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal Bayar</TableHead>
                  <TableHead>Metode Pembayaran</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Memuat data...</TableCell>
                  </TableRow>
               ) : pembayaran.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Kamu belum melakukan pendaftaran</TableCell>
                  </TableRow>
               ) : (
                  pembayaran.map((item, index) => (
                     <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.jumlah}</TableCell>
                        <TableCell>{dateFormat(item.tanggal)}</TableCell>
                        <TableCell>{item.metode}</TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   )
}