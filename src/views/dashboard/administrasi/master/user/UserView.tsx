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

import Loader from '@/components/common/Loader'
import { getAllUsers } from '@/services/user-service'
import { User } from '@/interfaces/user'
import { RoleBadge } from '@/components/common/RoleBadge'
import { Button } from '@/components/ui/button'
import { UserRoundPlus } from 'lucide-react'

export default function UserView() {
   const [dataRm, setDataRm] = useState<User[]>([])
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      getAllUsers()
         .then((users) => {
            setDataRm(users)
         })
         .catch((err) => {
            console.error(err)
            alert('Gagal mengambil data pengguna.')
         })
         .finally(() => setLoading(false))
   }, [])

   if (loading) return <Loader />

   const getNama = (user: User) =>
      user.pasien?.nama ??
      user.dokter?.nama ??
      user.staffAdministrasi?.nama ??
      user.staffPengelolaObat?.nama ??
      '-'
   const getNoTelp = (user: User) =>
      user.pasien?.noTelp ?? user.dokter?.noTelp ?? '-'

   return (
      <div className='space-y-2'>
         <div className='flex justify-end bg-white rounded-lg shadow p-2'>
            <Button className='flex items-center text-sm'>
               <UserRoundPlus />
               Buat User
            </Button>
         </div>
         <div className="bg-white rounded-lg shadow p-4">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>No</TableHead>
                     <TableHead>Nama</TableHead>
                     <TableHead>Username</TableHead>
                     <TableHead>Role</TableHead>
                     <TableHead>No Telp</TableHead>
                     <TableHead>Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {dataRm.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center">
                           Tidak ada data
                        </TableCell>
                     </TableRow>
                  ) : (
                     dataRm.map((user, index) => (
                        <TableRow key={user.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell>{getNama(user)}</TableCell>
                           <TableCell>{user.username}</TableCell>
                           <TableCell>
                              <RoleBadge role={user.role} />
                           </TableCell>
                           <TableCell>{getNoTelp(user)}</TableCell>
                           <TableCell>
                              <button className="text-blue-600 hover:underline"></button>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}