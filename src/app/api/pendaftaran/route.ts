import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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
      const session = await getServerSession(authOptions);

      if (!session?.user?.pasienId) {
         return NextResponse.json(
            { message: "Pasien belum terdaftar" },
            { status: 401 }
         );
      }

      const pasienId = parseInt(session.user.pasienId, 10);

      const { keluhan } = await request.json();

      const pendaftaran = await prisma.pendaftaran.create({
         data: {
            pasienId,
            keluhan,
         },
      });

      const lastAntrian = await prisma.antrian.findFirst({
         orderBy: { nomorUrut: "desc" },
      });

      const nextNomorUrut = (lastAntrian?.nomorUrut ?? 0) + 1;

      const antrian = await prisma.antrian.create({
         data: {
            pendaftaranId: pendaftaran.id,
            nomorUrut: nextNomorUrut,
         },
      });

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
