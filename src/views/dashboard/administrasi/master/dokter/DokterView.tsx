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
import { getAllDokter } from '@/services/dokter-service'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { BadgeInfo, Info, XIcon } from 'lucide-react'
import Loader from '@/components/common/Loader'
import { Dokter } from '@/interfaces/dokter'
import { dateFormat } from '@/utils/date-format'

export default function DokterView() {
   const [dataDokter, setDataDokter] = useState<Dokter[]>([]);
   const [selectedDokter, setSelectedDokter] = useState<Dokter | null>(null);
   const [loading, setLoading] = useState(true);
   const [showAlert, setShowAlert] = useState(true);

   useEffect(() => {
      const fetchPasien = async () => {
         try {
            const res = await getAllDokter();
            setDataDokter(res.data);
         } catch (error) {
            console.error("Gagal mengambil data dokter:", error);
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
      <>
         {showAlert && (
            <div className="flex items-center p-4 mb-4 text-blue-500 rounded-lg bg-blue-50" role="alert">
               <BadgeInfo size={18} />
               <div className="ms-3 text-sm font-medium">
                  Untuk melihat detail rekam medis dan pemeriksaan pasien, silahkan klik icon <Info size={16} className="inline" /> pada kolom aksi.
               </div>
               <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 cursor-pointer rounded-lg focus:ring-2 inline-flex items-center hover:bg-blue-100 justify-center h-8 w-8"
                  aria-label="Close"
               >
                  <XIcon size={18} />
               </button>
            </div>
         )}

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Dokter</TableHead>
                  <TableHead>Spesialisasi</TableHead>
                  <TableHead>No Telp</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {dataDokter.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center">Tidak ada data</TableCell>
                  </TableRow>
               ) : (
                  dataDokter.map((dokter, index) => (
                     <TableRow key={dokter.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{dokter.nama}</TableCell>
                        <TableCell>{dokter.spesialisasi || "-"}</TableCell>
                        <TableCell>{dokter.noTelp || "-"}</TableCell>
                        <TableCell className="text-center">
                           <Dialog>
                              <DialogTrigger asChild>
                                 <button
                                    onClick={() => setSelectedDokter(dokter)}
                                    className="text-blue-500 hover:underline"
                                 >
                                    <Info size={16} />
                                 </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                 <DialogHeader>
                                    <DialogTitle>Detail Dokter</DialogTitle>
                                 </DialogHeader>

                                 {selectedDokter && (
                                    <div className="space-y-4">
                                       {/* Rekam Medis */}
                                       <div>
                                          <h4 className="font-semibold">Rekam Medis</h4>
                                          {selectedDokter.rekamMedis?.length === 0 ? (
                                             <p className="text-sm italic text-gray-500">Tidak ada data rekam medis.</p>
                                          ) : (
                                             <ul className="list-disc ml-5 text-sm">
                                                {selectedDokter.rekamMedis?.map((rekam) => (
                                                   <li key={rekam.id}>
                                                      {dateFormat(rekam.tanggal)} - {rekam.isi}
                                                   </li>
                                                ))}
                                             </ul>
                                          )}
                                       </div>

                                       {/* Pemeriksaan */}
                                       <div>
                                          <h4 className="font-semibold">Pemeriksaan</h4>
                                          {selectedDokter.pemeriksaan?.length === 0 ? (
                                             <p className="text-sm italic text-gray-500">Tidak ada data pemeriksaan.</p>
                                          ) : (
                                             <ul className="list-disc ml-5 text-sm">
                                                {selectedDokter.pemeriksaan?.map((periksa) => (
                                                   <li key={periksa.id}>
                                                      {dateFormat(periksa.tanggal)} - Diagnosa: {periksa.diagnosa} (Keluhan: {periksa.keluhan})
                                                   </li>
                                                ))}
                                             </ul>
                                          )}
                                       </div>
                                    </div>
                                 )}
                              </DialogContent>
                           </Dialog>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </>
   );
}
