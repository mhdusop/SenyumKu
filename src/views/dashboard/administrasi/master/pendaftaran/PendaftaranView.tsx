'use client'

import { useEffect, useState } from 'react'
import {
   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getAllPendaftaran, updatePendaftaranStatus } from '@/services/pendaftaran-service'
import { Pendaftaran } from '@/interfaces/pendaftaran'
import { StatusType } from '@/interfaces/status'
import { dateFormat } from '@/utils/date-format'
import Loader from '@/components/common/Loader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Pencil } from 'lucide-react'

const STATUS_OPTIONS: StatusType[] = ["MENUNGGU", "DIPERIKSA", "SELESAI", "DIBATALKAN"];

export default function PendaftaranView() {
   const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([])
   const [loading, setLoading] = useState(true)
   const [editingId, setEditingId] = useState<number | null>(null)
   const [selectedStatus, setSelectedStatus] = useState<StatusType>("MENUNGGU")

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

   useEffect(() => {
      loadData()
   }, [])

   const handleEditClick = (id: number, currentStatus: StatusType) => {
      setEditingId(id)
      setSelectedStatus(currentStatus)
   }

   const handleSave = async () => {
      if (editingId !== null) {
         try {
            await updatePendaftaranStatus(editingId, selectedStatus)
            await loadData()
            setEditingId(null)
         } catch (error) {
            console.error("Gagal update status", error)
         }
      }
   }

   if (loading) {
      return <Loader />
   }

   return (
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
                  <TableHead className="text-center">Aksi</TableHead>
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
                        <TableCell>{item.antrian?.nomorUrut ?? '-'}</TableCell>
                        <TableCell className="text-center">
                           <Popover open={editingId === item.id} onOpenChange={(open) => {
                              if (!open) setEditingId(null)
                           }}>
                              <PopoverTrigger asChild>
                                 <button
                                    className='cursor-pointer'
                                    onClick={() => handleEditClick(item.id, item.status as StatusType)}
                                 >
                                    <Pencil size={16} className='text-yellow-400' />
                                 </button>
                              </PopoverTrigger>
                              <PopoverContent className='w-56 relative right-4'>
                                 <div className="flex flex-col gap-3 w-full">
                                    <Select
                                       value={selectedStatus}
                                       onValueChange={(val) => setSelectedStatus(val as StatusType)}
                                    >
                                       <SelectTrigger className='w-full'>
                                          <SelectValue placeholder="Pilih status" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          {STATUS_OPTIONS.map(status => (
                                             <SelectItem key={status} value={status}>
                                                {status}
                                             </SelectItem>
                                          ))}
                                       </SelectContent>
                                    </Select>
                                    <Button onClick={handleSave}>Simpan</Button>
                                 </div>
                              </PopoverContent>
                           </Popover>
                        </TableCell>
                     </TableRow>
                  ))
               )}
            </TableBody>
         </Table>
      </div>
   )
}