"use client"

import React, { useState } from "react"
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table"
import { Pemeriksaan } from "@/interfaces/pemeriksaan"
import { RekamMedis } from "@/interfaces/rekam-medis"
import { dateFormat } from "@/utils/date-format"
import { DialogDetailPemeriksaan } from "./DialogDetailPemeriksaan"

interface TableProps {
   pemeriksaan: Pemeriksaan[]
   rekamMedis?: RekamMedis[]
   isLoading: boolean
}

export function TablePemeriksaanPasien({ pemeriksaan, rekamMedis, isLoading }: TableProps) {
   const [selectedPemeriksaan, setSelectedPemeriksaan] = useState<Pemeriksaan | null>(null)

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const selectedRekamMedis = selectedPemeriksaan
      ? rekamMedis?.find(rm => rm.pemeriksaanId === selectedPemeriksaan.id)
      : null

   return (
      <div className="bg-white rounded-lg shadow p-4">
         <h2 className="font-semibold text-lg mb-4">Riwayat Pemeriksaan</h2>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[40px]">No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Diagnosa</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center">
                        Memuat data...
                     </TableCell>
                  </TableRow>
               ) : pemeriksaan.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center">
                        Belum ada pemeriksaan
                     </TableCell>
                  </TableRow>
               ) : (
                  pemeriksaan.map((item, index) => {
                     const rekam = rekamMedis?.find(rm => rm.pemeriksaanId === item.id)
                     return (
                        <TableRow key={item.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{dateFormat(item.tanggal)}</TableCell>
                           <TableCell>{item.keluhan}</TableCell>
                           <TableCell>{item.diagnosa}</TableCell>
                           <TableCell>{item.catatanTambahan ?? "-"}</TableCell>
                           <TableCell className="text-center">
                              <DialogDetailPemeriksaan
                                 pemeriksaan={item}
                                 rekamMedis={rekam}
                                 onTriggerClick={() => setSelectedPemeriksaan(item)}
                              />
                           </TableCell>
                        </TableRow>
                     )
                  })
               )}
            </TableBody>
         </Table>
      </div>
   )
}