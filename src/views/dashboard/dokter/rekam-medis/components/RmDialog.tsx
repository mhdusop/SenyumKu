import React from 'react';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { RekamMedis } from '@/interfaces/rekam-medis';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, UserCheck, FileText, Stethoscope } from 'lucide-react';

interface RekamMedisDetailDialogProps {
   isOpen: boolean;
   onClose: () => void;
   rekamMedis: RekamMedis | null;
}

export default function RekamMedisDetailDialog({
   isOpen,
   onClose,
   rekamMedis
}: RekamMedisDetailDialogProps) {
   if (!rekamMedis) return null;

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detail Rekam Medis
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
               {/* Header Info */}
               <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <div>
                           <p className="text-sm text-gray-600">Nama Pasien</p>
                           <p className="font-semibold text-gray-900">
                              {rekamMedis.pasien?.nama || 'Pasien tidak ditemukan'}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        <div>
                           <p className="text-sm text-gray-600">Dokter Pemeriksa</p>
                           <p className="font-semibold text-gray-900">
                              {rekamMedis.dokter?.nama || 'Dokter tidak ditemukan'}
                           </p>
                           {rekamMedis.dokter?.spesialisasi && (
                              <Badge variant="secondary" className="mt-1">
                                 {rekamMedis.dokter.spesialisasi}
                              </Badge>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <Separator />

               {/* Informasi Tanggal */}
               <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div>
                     <p className="text-sm text-gray-600">Tanggal Pemeriksaan</p>
                     <p className="font-medium text-gray-900">
                        {formatDate(rekamMedis.tanggal)}
                     </p>
                  </div>
               </div>

               <Separator />

               {/* Informasi Pemeriksaan (jika ada) */}
               {rekamMedis.pemeriksaan && (
                  <>
                     <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                           <Stethoscope className="h-4 w-4 text-green-600" />
                           <h3 className="font-semibold text-gray-900">Informasi Pemeriksaan</h3>
                        </div>
                        <div className="space-y-2">
                           <div>
                              <p className="text-sm text-gray-600">Keluhan</p>
                              <p className="text-gray-900">{rekamMedis.pemeriksaan.keluhan}</p>
                           </div>
                           <div>
                              <p className="text-sm text-gray-600">Diagnosa</p>
                              <p className="text-gray-900">{rekamMedis.pemeriksaan.diagnosa}</p>
                           </div>
                           {rekamMedis.pemeriksaan.catatanTambahan && (
                              <div>
                                 <p className="text-sm text-gray-600">Catatan Tambahan</p>
                                 <p className="text-gray-900">{rekamMedis.pemeriksaan.catatanTambahan}</p>
                              </div>
                           )}
                        </div>
                     </div>
                     <Separator />
                  </>
               )}

               {/* Isi Rekam Medis */}
               <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Catatan Rekam Medis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                     <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {rekamMedis.isi}
                     </p>
                  </div>
               </div>

               {/* Informasi Resep (jika ada) */}
               {rekamMedis.resep && rekamMedis.resep.length > 0 && (
                  <>
                     <Separator />
                     <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Resep Obat</h3>
                        <div className="space-y-3">
                           {rekamMedis.resep.map((resep, index) => (
                              <div key={resep.id || index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div>
                                       <p className="text-sm text-gray-600">Nama Obat</p>
                                       <p className="font-medium">{resep?.obat?.nama || 'Obat tidak ditemukan'}</p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">Jumlah</p>
                                       <p className="font-medium">{resep.jumlah} {resep.obat?.stok || ''}</p>
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">Aturan Pakai</p>
                                       <p className="font-medium">{resep.aturan}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </>
               )}

               {/* Footer Info */}
               <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                  <p>ID Rekam Medis: {rekamMedis.id}</p>
                  {rekamMedis.pemeriksaanId && (
                     <p>ID Pemeriksaan: {rekamMedis.pemeriksaanId}</p>
                  )}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}