// app/api/dokter/resep/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { dokterId, obatId, jumlah, aturan, rekamMedisId } = body;

      // Validasi input
      if (!dokterId || !obatId || !jumlah || !aturan) {
         return NextResponse.json(
            { success: false, error: "Semua field harus diisi." },
            { status: 400 }
         );
      }

      // Konversi ID menjadi integer
      const dokterIdInt = parseInt(dokterId, 10);
      const obatIdInt = parseInt(obatId, 10);
      const jumlahInt = parseInt(jumlah, 10);
      const rekamMedisIdInt = rekamMedisId ? parseInt(rekamMedisId, 10) : null;

      // Validasi dokter
      const dokter = await prisma.dokter.findUnique({
         where: { id: dokterIdInt }, // Pastikan ID adalah integer
      });
      if (!dokter) {
         return NextResponse.json(
            { success: false, error: "Dokter tidak ditemukan." },
            { status: 404 }
         );
      }

      // Validasi obat
      const obat = await prisma.obat.findUnique({
         where: { id: obatIdInt }, // Pastikan ID adalah integer
      });
      if (!obat) {
         return NextResponse.json(
            { success: false, error: "Obat tidak ditemukan." },
            { status: 404 }
         );
      }

      // Validasi stok obat
      if (obat.stok < jumlahInt) {
         return NextResponse.json(
            { success: false, error: "Stok obat tidak mencukupi." },
            { status: 400 }
         );
      }

      // Buat resep obat dalam transaksi
      const newResep = await prisma.$transaction(async (prisma) => {
         // Kurangi stok obat
         await prisma.obat.update({
            where: { id: obatIdInt },
            data: { stok: obat.stok - jumlahInt },
         });

         // Buat resep
         return prisma.resep.create({
            data: {
               dokterId: dokterIdInt,
               obatId: obatIdInt,
               jumlah: jumlahInt,
               aturan,
               rekamMedisId: rekamMedisIdInt, // Hanya jika ada rekam medis
            },
            include: {
               dokter: true,
               obat: true,
            },
         });
      });

      return NextResponse.json({ success: true, data: newResep });
   } catch (error) {
      console.error("Error creating resep:", error);
      return NextResponse.json(
         { success: false, error: "Gagal membuat resep." },
         { status: 500 }
      );
   }
}
