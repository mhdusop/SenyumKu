"use client";

import React, { useState, useEffect } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { getDaftarObat } from "@/services/farmasi/obat-service";
import { getResepList } from "@/services/farmasi/resep-service";
import { Obat } from "@/interfaces/obat";
import { Resep } from "@/interfaces/resep";
import Loader from "@/components/common/Loader";

export default function PengelolaObatDashboardView() {
   const [obatList, setObatList] = useState<Obat[]>([]);
   const [resepList, setResepList] = useState<Resep[]>([]);
   const [loading, setLoading] = useState(false);

   const fetchData = async () => {
      try {
         setLoading(true);

         // Fetch data obat
         const obatResponse = await getDaftarObat();
         if (obatResponse) {
            setObatList(obatResponse);
         }

         // Fetch data resep
         const resepResponse = await getResepList();
         if (resepResponse) {
            setResepList(resepResponse);
         }
      } catch (error) {
         console.error("Error fetching data:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   if (loading) {
      return <Loader />;
   }

   return (
      <div className="space-y-4">
         <h1 className="text-3xl font-bold text-start">Dashboard Farmasi</h1>

         {/* Data Obat */}
         <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Data Obat</h2>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nama</TableHead>
                     <TableHead>Stok</TableHead>
                     <TableHead>Satuan</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {obatList.length > 0 ? (
                     obatList.map((obat) => (
                        <TableRow key={obat.id}>
                           <TableCell>{obat.id}</TableCell>
                           <TableCell>{obat.nama}</TableCell>
                           <TableCell>{obat.stok}</TableCell>
                           <TableCell>{obat.satuan}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500">
                           Tidak ada data obat.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>

         {/* Data Resep */}
         <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Data Resep</h2>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nama Obat</TableHead>
                     <TableHead>Jumlah</TableHead>
                     <TableHead>Aturan</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {resepList.length > 0 ? (
                     resepList.map((resep) => (
                        <TableRow key={resep.id}>
                           <TableCell>{resep.id}</TableCell>
                           <TableCell>{resep.obat.nama}</TableCell>
                           <TableCell>{resep.jumlah}</TableCell>
                           <TableCell>{resep.aturan}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                           Tidak ada data resep.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}