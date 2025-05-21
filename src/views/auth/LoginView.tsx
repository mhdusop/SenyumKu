"use client"

import { useState } from "react"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { dismissToast, showError, showLoading, showSuccess } from "@/utils/toast"
import Link from "next/link"

export default function LoginView() {
   const [form, setForm] = useState({ username: "", password: "" })
   const [error, setError] = useState("")
   const router = useRouter()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const loading = showLoading("Sedang Login...")

      const res = await signIn("credentials", {
         redirect: false,
         username: form.username,
         password: form.password,
      })

      dismissToast(loading)

      if (res?.error) {
         setError("Username atau password salah")
         showError("Gagal Login, Periksa kembali Username dan Password kamu")
      } else {
         showSuccess("Berhasil Login!")

         const session = await getSession()
         const role = session?.user?.role

         switch (role) {
            case "PASIEN":
               router.push("/dashboard")
               break
            case "DOKTER":
               router.push("/dashboard/data-laporan/resep")
               break
            case "PENGELOLA_OBAT":
               router.push("/dashboard/kelola-obat/resep-obat")
               break
            case "ADMINISTRASI":
               router.push("/dashboard/master-data/pendaftaran")
               break
            default:
               router.push("/dashboard")
               break
         }
      }
   }

   return (
      <div className="flex justify-center items-center min-h-screen px-4">
         <Card className="w-full max-w-md shadow-md">
            <CardHeader>
               <CardTitle className="text-2xl text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                     <Label htmlFor="username">Username</Label>
                     <Input className="mt-1.5" id="username" name="username" onChange={handleChange} value={form.username} required />
                  </div>
                  <div>
                     <Label htmlFor="password">Password</Label>
                     <Input className="mt-1.5" type="password" id="password" name="password" onChange={handleChange} value={form.password} required />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="space-y-2">
                     <small>Belum punya akun? silahkan daftar <Link className="text-sm text-blue-500 hover:underline" href="/auth/register">disini</Link></small>
                     <Button type="submit" className="w-full mt-4 cursor-pointer">
                        Masuk
                     </Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}