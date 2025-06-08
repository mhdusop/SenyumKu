'use client'

import { useEffect, useState } from 'react'
import {
   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { getDaftarPasien } from '@/services/dokter/daftar-pasien-service'
import { Pendaftaran } from '@/interfaces/pendaftaran'
import { StatusType } from '@/interfaces/status'
import { dateFormat } from '@/utils/date-format'
import Loader from '@/components/common/Loader'
import { StatusBadge } from '@/components/common/StatusBadge'

export default function ListDaftarPasienView() {
   const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([])
   const [loading, setLoading] = useState(true)

   const loadData = async () => {
      try {
         const data = await getDaftarPasien()
         setPendaftaranList(data)
      } catch (error) {
         console.error(error, 'Gagal memuat data pendaftaran')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      loadData()
   }, [])

   if (loading) {
      return <Loader />
   }

   return (
      <div className='space-y-4'>
         <div className='flex justify-start'>
            <h1 className='text-2xl font-semibold'>List Daftar Pasien</h1>
         </div>
         <div className='bg-white rounded-lg shadow p-4'>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[100px]">No</TableHead>
                     <TableHead>Nama Pasien</TableHead>
                     <TableHead>Tanggal Daftar</TableHead>
                     <TableHead>Keluhan</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>No Antrian</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {pendaftaranList.length === 0 ? (
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
                           <TableCell>
                              <StatusBadge status={item.status as StatusType} />
                           </TableCell>
                           <TableCell>A-{item.antrian?.nomorUrut ?? '-'}</TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}