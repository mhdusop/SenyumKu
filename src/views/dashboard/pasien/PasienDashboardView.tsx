"use client";

import Logo1 from "../../../../public/logo/1.png"
import { useEffect, useState } from "react";
import { TablePendaftaranPasien } from "./components/TablePendaftaranPasien.tsx";
import { getPasienSelf } from "@/services/self-service";
import { Pasien } from "@/interfaces/pasien";
import HelloComponent from "./components/HelloComponent";
import { TablePembayaranPasien } from "./components/TablePembayaranPasien";
import { TablePemeriksaanPasien } from "./components/TablePemeriksaanPasien";

export default function PasienDashboardView() {

   const [pasien, setPasien] = useState<Pasien | null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchData = async () => {
         try {
            const data = await getPasienSelf();
            setPasien(data);
         } catch (err) {
            console.error("Gagal mengambil data pendaftaran:", err);
            setPasien(null);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   return (
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 w-full">

         {/* main side */}
         <div className="basis-2/3 space-y-4 w-full">
            <HelloComponent
               name={pasien?.nama ?? "Guest"}
               logo={Logo1}
            />
            <TablePendaftaranPasien
               pendaftaran={pasien?.pendaftaran ?? []}
               isLoading={loading}
            />
            <TablePemeriksaanPasien
               pemeriksaan={pasien?.pemeriksaan ?? []}
               rekamMedis={pasien?.rekamMedis}
               isLoading={loading} />
         </div>

         {/* right side */}
         <div className="lg:basis-1/3 w-full">
            <TablePembayaranPasien
               pembayaran={pasien?.pembayaran ?? []}
               isLoading={loading}
            />
         </div>
      </div>
   )
}