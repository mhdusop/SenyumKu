"use client"

import React from "react"
import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Info } from "lucide-react"
import { Pemeriksaan } from "@/interfaces/pemeriksaan"
import { RekamMedis } from "@/interfaces/rekam-medis"
import { Resep } from "@/interfaces/resep"
import { dateFormat } from "@/utils/date-format"

interface DialogDetailPemeriksaanProps {
   pemeriksaan: Pemeriksaan
   rekamMedis?: RekamMedis
   onTriggerClick?: () => void
}

export function DialogDetailPemeriksaan({
   pemeriksaan,
   rekamMedis,
   onTriggerClick
}: DialogDetailPemeriksaanProps) {
   return (
      <Dialog>
         <DialogTrigger asChild>
            <button
               onClick={onTriggerClick}
               className="bg-transparent hover:bg-transparent text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
               aria-label={`Lihat detail pemeriksaan tanggal ${dateFormat(pemeriksaan.tanggal)}`}
               title="Lihat detail pemeriksaan"
            >
               <Info size={16} />
            </button>
         </DialogTrigger>

         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>Detail Riwayat Pemeriksaan</DialogTitle>
            </DialogHeader>

            <div className="space-y-2">
               {/* Info Dokter */}
               <div className="flex gap-2">
                  <p className="text-sm font-semibold min-w-fit">Nama Dokter:</p>
                  <span className="text-sm text-gray-600">
                     {pemeriksaan.dokter.nama ?? "-"}
                  </span>
               </div>

               {/* Rekam Medis */}
               {rekamMedis && (
                  <div className="flex gap-2">
                     <p className="text-sm font-semibold min-w-fit">Ringkasan:</p>
                     <span className="text-sm text-gray-600">
                        {rekamMedis.isi}
                     </span>
                  </div>
               )}

               {/* Resep Obat */}
               <div>
                  <p className="text-sm font-semibold mb-2">Resep Obat:</p>
                  {rekamMedis && rekamMedis.resep.length > 0 ? (
                     <div className="space-y-3">
                        {rekamMedis.resep.map((resep, index) => (
                           <div
                              key={resep.id || index}
                              className="bg-gray-50 p-3 rounded-lg border"
                           >
                              <div className="grid grid-cols-1 gap-2">
                                 <div className="flex gap-2">
                                    <p className="text-xs font-medium min-w-fit">Nama Obat:</p>
                                    <span className="text-xs text-gray-600">
                                       {(resep as Resep).obat?.nama || 'Obat tidak ditemukan'}
                                    </span>
                                 </div>
                                 <div className="flex gap-2">
                                    <p className="text-xs font-medium min-w-fit">Aturan Pakai:</p>
                                    <span className="text-xs text-gray-600">
                                       {resep.aturan}
                                    </span>
                                 </div>
                                 <div className="flex gap-2">
                                    <p className="text-xs font-medium min-w-fit">Jumlah:</p>
                                    <span className="text-xs text-gray-600">
                                       {resep.jumlah}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-sm italic text-gray-500 bg-gray-50 p-3 rounded-lg">
                        Tidak ada resep obat.
                     </p>
                  )}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   )
}