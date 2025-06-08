import { useState, useEffect } from "react";
import { getDaftarPasien } from "@/services/dokter/daftar-pasien-service";
import { Pendaftaran } from "@/interfaces/pendaftaran";

export function usePasien() {
   const [daftarPasien, setDaftarPasien] = useState<Pendaftaran[]>([]);
   const [loading, setLoading] = useState(true);

   const fetchDaftarPasien = async () => {
      try {
         const data = await getDaftarPasien();
         setDaftarPasien(data);
      } catch (err) {
         console.error("Gagal memuat daftar pasien:", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDaftarPasien();
   }, []);

   return { daftarPasien, loading, fetchDaftarPasien };
}
