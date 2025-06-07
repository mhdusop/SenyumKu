import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

// GET - Mendapatkan daftar pemeriksaan pasien
export async function GET() {
   try {
      const pemeriksaanList = await prisma.pemeriksaan.findMany({
         include: {
            pasien: true,
            dokter: true,
         },
         orderBy: {
            tanggal: "desc",
         },
      });

      return NextResponse.json({
         success: true,
         data: pemeriksaanList,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to fetch pemeriksaan pasien" },
         { status: 500 }
      );
   }
}

// POST - Membuat pemeriksaan pasien baru
export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
         return NextResponse.json(
            { success: false, error: "Dokter belum login" },
            { status: 401 }
         );
      }

      const body = await request.json();
      const { pasienId, keluhan, diagnosa, catatanTambahan } = body;

      // Memastikan ID dokter valid
      const dokter = await prisma.dokter.findUnique({
         where: { userId: Number(session.user.id) },
      });

      if (!dokter) {
         return NextResponse.json(
            { success: false, error: "Dokter tidak ditemukan" },
            { status: 404 }
         );
      }

      const newPemeriksaan = await prisma.pemeriksaan.create({
         data: {
            pasienId,
            dokterId: dokter.id,
            keluhan,
            diagnosa,
            catatanTambahan,
            tanggal: new Date(),
         },
      });

      return NextResponse.json({
         success: true,
         data: newPemeriksaan,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to create pemeriksaan pasien" },
         { status: 500 }
      );
   }
}

// PUT - Memperbarui data pemeriksaan pasien
export async function PUT(request: NextRequest) {
   try {
      const body = await request.json();
      const { id, keluhan, diagnosa, catatanTambahan } = body;

      const updatedPemeriksaan = await prisma.pemeriksaan.update({
         where: { id },
         data: {
            keluhan,
            diagnosa,
            catatanTambahan,
         },
      });

      return NextResponse.json({
         success: true,
         data: updatedPemeriksaan,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to update pemeriksaan pasien" },
         { status: 500 }
      );
   }
}

// DELETE - Menghapus data pemeriksaan pasien
export async function DELETE(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const id = parseInt(searchParams.get("id") || "");

      await prisma.pemeriksaan.delete({
         where: { id },
      });

      return NextResponse.json({
         success: true,
         message: "Pemeriksaan pasien deleted successfully",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to delete pemeriksaan pasien" },
         { status: 500 }
      );
   }
}
