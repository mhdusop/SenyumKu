'use client'

import {
   Dialog,
   DialogTrigger,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
   Select,
   SelectItem,
   SelectTrigger,
   SelectContent,
   SelectValue,
} from '@/components/ui/select'
import { UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { RoleType } from '@/interfaces/role'
import { createUser } from '@/services/user-service'

const allowedRoles: RoleType[] = ['ADMINISTRASI', 'PENGELOLA_OBAT', 'DOKTER']

export default function CreateUserDialog({ onSuccess }: { onSuccess?: () => void }) {
   const [open, setOpen] = useState(false)
   const [form, setForm] = useState({
      username: '',
      password: '',
      nama: '',
      noTelp: '',
      spesialisasi: '',
      role: 'ADMINISTRASI' as RoleType,
   })
   const [loading, setLoading] = useState(false)

   const handleSubmit = async () => {
      if (!form.username || !form.password || !form.nama) {
         alert('Mohon lengkapi semua field wajib.')
         return
      }

      try {
         setLoading(true)
         await createUser(form)
         setOpen(false)
         setForm({
            username: '',
            password: '',
            nama: '',
            noTelp: '',
            spesialisasi: '',
            role: 'ADMINISTRASI',
         })
         onSuccess?.()
      } catch (error) {
         console.error('Failed to create user:', error)
         alert('Gagal membuat user.')
      } finally {
         setLoading(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="flex items-center text-sm gap-1">
               <UserRoundPlus size={16} />
               Buat User
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Buat User Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className='space-y-2'>
                  <Label>Role</Label>
                  <Select
                     value={form.role}
                     onValueChange={(val) =>
                        setForm({ ...form, role: val as RoleType })
                     }
                  >
                     <SelectTrigger className='!w-full'>
                        <SelectValue placeholder="Pilih Role" />
                     </SelectTrigger>
                     <SelectContent>
                        {allowedRoles.map((role) => (
                           <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() +
                                 role.slice(1).toLowerCase().replace('_', ' ')}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               <div className='space-y-2'>
                  <Label>Username</Label>
                  <Input
                     value={form.username}
                     onChange={(e) => setForm({ ...form, username: e.target.value })}
                  />
               </div>
               <div className='space-y-2'>
                  <Label>Nama Lengkap</Label>
                  <Input
                     value={form.nama}
                     onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  />
               </div>
               <div className='space-y-2'>
                  <Label>Password</Label>
                  <Input
                     type="password"
                     value={form.password}
                     onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
               </div>
               {form.role === 'DOKTER' && (
                  <>
                     <div className='space-y-2'>
                        <Label>No. Telepon</Label>
                        <Input
                           value={form.noTelp}
                           onChange={(e) =>
                              setForm({ ...form, noTelp: e.target.value })
                           }
                        />
                     </div>
                     <div className='space-y-2'>
                        <Label>Spesialisasi</Label>
                        <Input
                           value={form.spesialisasi}
                           onChange={(e) =>
                              setForm({ ...form, spesialisasi: e.target.value })
                           }
                        />
                     </div>
                  </>
               )}
            </div>
            <DialogFooter>
               <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Simpan'}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}