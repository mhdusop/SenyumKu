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
import { getAllUsers, deleteUser } from '@/services/user-service'
import { User } from '@/interfaces/user'
import { RoleBadge } from '@/components/common/RoleBadge'
import CreateUserDialog from './components/UserDialog'
import { Trash, Download } from 'lucide-react'
import { ConfirmDialog } from './components/ConfirmDialog'
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast'
import { Button } from '@/components/ui/button'
import { exportToExcel, formatTableDataForExport } from '@/utils/excel'

export default function UserView() {
   const [dataRm, setDataRm] = useState<User[]>([])
   const [loading, setLoading] = useState(true)
   const [confirmOpen, setConfirmOpen] = useState(false)
   const [userToDelete, setUserToDelete] = useState<User | null>(null)

   const fetchUsers = () => {
      setLoading(true)
      getAllUsers()
         .then((users) => {
            setDataRm(users)
         })
         .catch((err) => {
            console.error(err)
            showError("Gagal mengambil data pengguna.")
         })
         .finally(() => setLoading(false))
   }

   useEffect(() => {
      fetchUsers()
   }, [])

   const handleDelete = async () => {
      if (!userToDelete) return

      const toastId = showLoading("Menghapus user...")

      try {
         await deleteUser(userToDelete.id)
         dismissToast(toastId)
         showSuccess("User berhasil dihapus")
         fetchUsers()
      } catch (error) {
         dismissToast(toastId)
         showError(error instanceof Error ? error.message : "Gagal menghapus user")
      } finally {
         setUserToDelete(null)
         setConfirmOpen(false)
      }
   }

   const openDeleteConfirm = (user: User) => {
      if (user.role === 'ADMINISTRASI') {
         showError("User administrasi tidak dapat dihapus")
         return
      }

      setUserToDelete(user)
      setConfirmOpen(true)
   }

   const handleExportExcel = () => {
      const exportData = formatTableDataForExport(dataRm, (user, index) => ({
         'No': index + 1,
         'Nama': getNama(user),
         'Username': user.username,
         'Role': user.role,
         'No Telp': getNoTelp(user),
      }));

      exportToExcel(exportData, 'Data_User', 'Users');
   }

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
         <div className='flex justify-end bg-white rounded-lg shadow p-2 gap-2'>
            {/* Export to Excel Button */}
            <Button
               onClick={handleExportExcel}
               className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
               disabled={dataRm.length === 0}
            >
               <Download size={16} />
               Export Excel
            </Button>

            <CreateUserDialog
               onSuccess={fetchUsers}
            />
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
                     <TableHead className='text-center'>Aksi</TableHead>
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
                           <TableCell className='flex justify-center'>
                              <button
                                 className='cursor-pointer'
                                 onClick={() => openDeleteConfirm(user)}
                              >
                                 <Trash
                                    className={`${user.role === 'ADMINISTRASI' ? 'text-gray-300' : 'text-red-400'}`}
                                    size={17}
                                 />
                              </button>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>

         <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            onConfirm={handleDelete}
            title="Hapus User"
            description={`Apakah anda yakin ingin menghapus user ${userToDelete?.username || ''}?`}
         />
      </div>
   )
}