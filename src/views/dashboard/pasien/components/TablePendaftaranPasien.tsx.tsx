"use client"

import { StatusBadge } from "@/components/common/StatusBadge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Pendaftaran } from "@/interfaces/pendaftaran";
import { StatusType } from "@/interfaces/status";
import { dateFormat } from "@/utils/date-format"

interface TableProps {
   pendaftaran: Pendaftaran[];
   isLoading: boolean
}

export function TablePendaftaranPasien({ pendaftaran, isLoading }: TableProps) {
   return (
      <div className="bg-white rounded-lg shadow p-4">
         <h2 className="font-semibold text-lg mb-2">Riwayat Pendaftaran</h2>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[40px]">No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Nomor Antrian</TableHead>
                  <TableHead>Status</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Memuat data...</TableCell>
                  </TableRow>
               ) : pendaftaran.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Kamu belum melakukan pendaftaran</TableCell>
                  </TableRow>
               ) : (
                  pendaftaran.map((item: Pendaftaran, index: number) => (
                     <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{dateFormat(item.tanggalDaftar)}</TableCell>
                        <TableCell>{item.keluhan}</TableCell>
                        <TableCell>A-{item.antrian?.nomorUrut}</TableCell>
                        <TableCell>
                           <StatusBadge status={item.status as StatusType} />
                        </TableCell>
                     </TableRow>
                  ))
               )}

            </TableBody>
         </Table>
      </div>
   )
}