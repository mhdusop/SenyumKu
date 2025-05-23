"use client";

import { createPendaftaran } from "@/services/pendaftaran-service";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { dismissToast, showError, showLoading, showSuccess } from "@/utils/toast"
import { useRouter } from "next/navigation";

export interface Payload {
   keluhan: string;
}

export default function DaftarPasienView() {
   const [keluhan, setKeluhan] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const toastId = showLoading("Sedang membuat pendaftaran...");

      try {
         const result = await createPendaftaran({ keluhan });
         const nomor = result.antrian?.nomorUrut || "-";

         showSuccess(`Pendaftaran berhasil! Nomor antrian Anda: ${nomor}`);
         setTimeout(() => {
            router.push("/dashboard/pasien");
         }, 1500);
      } catch (err) {
         console.error(err);
         const message = "Terjadi kesalahan saat mendaftar.";
         showError(message);
      } finally {
         dismissToast(toastId);
         setLoading(false);
      }
   };

   return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md bg-white">
         <h2 className="text-xl font-semibold mb-4">Form Pendaftaran Pasien</h2>

         <div className="mb-4">
            <label htmlFor="keluhan" className="block mb-1 font-medium text-sm text-gray-500">
               Keluhan
            </label>
            <textarea
               id="keluhan"
               value={keluhan}
               onChange={(e) => setKeluhan(e.target.value)}
               required
               rows={4}
               className="w-full border border-gray-300 rounded px-3 py-2"
               placeholder="Masukkan keluhan Anda..."
            />
         </div>
         <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 cursor-pointer disabled:opacity-50`}
         >
            {loading ? (
               <LoaderCircle className="animate-spin" />
            ) : "Buat Pendaftaran"}
         </button>
      </form>
   )
}