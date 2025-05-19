"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { dismissToast, showError, showLoading, showSuccess } from "@/lib/toast"

export default function RegisterPage() {
   const [form, setForm] = useState({
      username: "",
      password: "",
      nama: "",
      alamat: "",
      noTelp: "",
   })
   const [error, setError] = useState("")
   const router = useRouter()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      const loading = showLoading("Mendaftarkan akun...")

      const res = await fetch("/api/auth/register", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ ...form, role: "PASIEN" }),
      })

      dismissToast(loading)

      if (!res.ok) {
         const data = await res.json()
         setError(data.error || "Terjadi kesalahan")
         showError(data.error || "Terjadi kesalahan saat mendaftar.")
         return
      }

      showSuccess("Berhasil mendaftar! Silakan login.")
      router.push("/auth/login")
   }

   return (
      <div className="flex justify-center items-center min-h-screen px-4">
         <Card className="w-full max-w-md shadow-md">
            <CardHeader>
               <CardTitle className="text-2xl text-center">Daftar Pasien</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label htmlFor="nama">Nama Lengkap</Label>
                     <Input className="mt-1.5" id="nama" name="nama" onChange={handleChange} value={form.nama} required />
                  </div>
                  <div>
                     <Label htmlFor="username">Username</Label>
                     <Input className="mt-1.5" id="username" name="username" onChange={handleChange} value={form.username} required />
                  </div>
                  <div>
                     <Label htmlFor="password">Password</Label>
                     <Input className="mt-1.5" type="password" id="password" name="password" onChange={handleChange} value={form.password} required />
                  </div>
                  <div>
                     <Label htmlFor="alamat">Alamat</Label>
                     <Input className="mt-1.5" id="alamat" name="alamat" onChange={handleChange} value={form.alamat} />
                  </div>
                  <div>
                     <Label htmlFor="noTelp">No. Telepon</Label>
                     <Input className="mt-1.5" id="noTelp" name="noTelp" onChange={handleChange} value={form.noTelp} />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <Button type="submit" className="w-full mt-4 cursor-pointer">
                     Daftar
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}