import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all Pendaftaran
export async function GET() {
   try {
      const data = await prisma.pendaftaran.findMany({
         include: {
            pasien: true,
            antrian: true,
         },
      });

      console.log(data);

      return NextResponse.json(data);
   } catch (error) {
      console.error("[PENDAFTARAN_GET]", error);
      return NextResponse.json(
         { message: "Terjadi kesalahan" },
         { status: 500 }
      );
   }
}

// Create Pendaftaran
export async function POST(request: Request) {
   try {
      const { pasienId, keluhan } = await request.json();

      // Buat pendaftaran baru
      const pendaftaran = await prisma.pendaftaran.create({
         data: {
            pasienId,
            keluhan,
         },
      });

      // Cari nomor urut antrian terakhir
      const lastAntrian = await prisma.antrian.findFirst({
         orderBy: { nomorUrut: "desc" },
      });

      const nextNomorUrut = (lastAntrian?.nomorUrut ?? 0) + 1;

      // Buat data antrian baru yang kait ke pendaftaran
      const antrian = await prisma.antrian.create({
         data: {
            pendaftaranId: pendaftaran.id,
            nomorUrut: nextNomorUrut,
         },
      });

      // Return gabungan data (optional)
      return NextResponse.json({
         pendaftaran,
         antrian,
      });
   } catch (error) {
      console.error("[PENDAFTARAN_POST]", error);
      return NextResponse.json(
         { message: "Gagal membuat pendaftaran" },
         { status: 500 }
      );
   }
}
