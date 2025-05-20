'use client'

import { useEffect, useState } from 'react'
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table'
import { getAllPendaftaran } from '@/services/pendaftaran-service'
import { Pendaftaran } from '@/interfaces/pendaftaran'
import { dateFormat } from '@/utils/date-format'

export default function PendaftaranPage() {
   const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const loadData = async () => {
         try {
            const data = await getAllPendaftaran()
            setPendaftaranList(data)
         } catch (error) {
            console.error(error, 'Gagal memuat data pendaftaran')
         } finally {
            setLoading(false)
         }
      }

      loadData()
   }, [])

   return (
      <div>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead>Keluhan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>No Antrian</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {loading ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Memuat data...</TableCell>
                  </TableRow>
               ) : pendaftaranList.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={7} className='text-center'>Tidak ada data</TableCell>
                  </TableRow>
               ) : (
                  pendaftaranList.map((item, index) => (
                     <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.pasien.nama}</TableCell>
                        <TableCell>{dateFormat(item.tanggalDaftar)}</TableCell>
                        <TableCell>{item.keluhan}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.antrian?.nomorUrut ?? '-'}</TableCell>
                        <TableCell className="text-right">-</TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   )
}