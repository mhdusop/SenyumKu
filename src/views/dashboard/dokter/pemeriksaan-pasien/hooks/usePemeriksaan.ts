import { useState, useEffect } from "react";
import { getPemeriksaanPasien } from "@/services/dokter/pemeriksaan-pasien-service";
import { Pemeriksaan } from "@/interfaces/pemeriksaan";

export function usePemeriksaan() {
   const [pemeriksaanList, setPemeriksaanList] = useState<Pemeriksaan[]>([]);
   const [loading, setLoading] = useState(true);

   const fetchPemeriksaanPasien = async () => {
      try {
         setLoading(true);
         const data = await getPemeriksaanPasien();
         setPemeriksaanList(data);
      } catch (err) {
         console.error("Gagal memuat data pemeriksaan pasien:", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPemeriksaanPasien();
   }, []);

   return { pemeriksaanList, loading, fetchPemeriksaanPasien };
}
