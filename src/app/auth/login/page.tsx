"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
   const [form, setForm] = useState({ username: "", password: "" })
   const [error, setError] = useState("")
   const router = useRouter()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setForm({ ...form, [name]: value })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      const res = await signIn("credentials", {
         redirect: false,
         username: form.username,
         password: form.password,
      })

      if (res?.error) {
         setError("Username atau password salah")
      } else {
         router.push("/dashboard")
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

                  <Button type="submit" className="w-full mt-4">
                     Masuk
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   )
}