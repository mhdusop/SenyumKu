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
import { getAllPasien } from '@/services/pasien-service'
import { Pasien } from '@/interfaces/pasien'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog'
import { BadgeInfo, Info, XIcon } from 'lucide-react'
import Loader from '@/components/common/Loader'

export default function PasienView() {
   const [dataPasien, setDataPasien] = useState<Pasien[]>([]);
   const [selectedPasien, setSelectedPasien] = useState<Pasien | null>(null);
   const [loading, setLoading] = useState(true);
   const [showAlert, setShowAlert] = useState(true);

   useEffect(() => {
      const fetchPasien = async () => {
         try {
            const res = await getAllPasien();
            setDataPasien(res.data);
         } catch (error) {
            console.error("Gagal mengambil data pasien:", error);
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
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>No Telp</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {dataPasien.map((pasien, index) => (
                  (dataPasien.length === 0 ? (
                     <TableRow key={pasien.id}>
                        <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                     </TableRow>
                  ) : (
                     <TableRow key={pasien.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{pasien.nama}</TableCell>
                        <TableCell>{pasien.noTelp || "-"}</TableCell>
                        <TableCell>{pasien.alamat || "-"}</TableCell>
                        <TableCell className="text-center">
                           <Dialog>
                              <DialogTrigger asChild>
                                 <button
                                    onClick={() => setSelectedPasien(pasien)}
                                    className='bg-transparent hover:bg-transparent text-blue-400 shadow-none cursor-pointer'
                                 >
                                    <Info size={16} />
                                 </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                 <DialogHeader>
                                    <DialogTitle>Detail Pasien</DialogTitle>
                                 </DialogHeader>

                                 {selectedPasien && (
                                    <div className="space-y-4">
                                       {/* Rekam Medis */}
                                       <div>
                                          <h4 className="font-semibold">Rekam Medis</h4>
                                          {selectedPasien.rekamMedis.length === 0 ? (
                                             <p className="text-sm italic text-gray-500">Tidak ada data rekam medis.</p>
                                          ) : (
                                             <ul className="list-disc ml-5 text-sm">
                                                {selectedPasien.rekamMedis.map((rekam) => (
                                                   <li key={rekam.id}>
                                                      {new Date(rekam.tanggal).toLocaleDateString("id-ID")} - {rekam.isi}
                                                   </li>
                                                ))}
                                             </ul>
                                          )}
                                       </div>

                                       <div>
                                          <h4 className="font-semibold">Pemeriksaan</h4>
                                          {selectedPasien.pemeriksaan.length === 0 ? (
                                             <p className="text-sm italic text-gray-500">Tidak ada data pemeriksaan.</p>
                                          ) : (
                                             <ul className="list-disc ml-5 text-sm">
                                                {selectedPasien.pemeriksaan.map((periksa) => (
                                                   <li key={periksa.id}>
                                                      {new Date(periksa.tanggal).toLocaleDateString("id-ID")} - Diagnosa: {periksa.diagnosa} (Keluhan: {periksa.keluhan})
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
               ))}
            </TableBody>
         </Table>
      </>
   );
}