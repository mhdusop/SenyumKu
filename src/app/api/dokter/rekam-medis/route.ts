/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { Prisma } from "@prisma/client";

// GET - Mendapatkan daftar rekam medis
export async function GET() {
   try {
      const rekamMedisList = await prisma.rekamMedis.findMany({
         include: {
            pasien: true,
            dokter: true,
            pemeriksaan: true,
         },
         orderBy: {
            tanggal: "desc",
         },
      });

      return NextResponse.json({
         success: true,
         data: rekamMedisList,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to fetch rekam medis" },
         { status: 500 }
      );
   }
}

// POST - Membuat rekam medis baru
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
      const { pasien, pemeriksaanId, isi, tanggal } = body;

      if (!pasien || !pasien.id || !isi) {
         return NextResponse.json(
            { success: false, error: "Data tidak lengkap" },
            { status: 400 }
         );
      }

      const dokter = await prisma.dokter.findUnique({
         where: { userId: Number(session.user.id) },
      });

      if (!dokter) {
         return NextResponse.json(
            { success: false, error: "Dokter tidak ditemukan" },
            { status: 404 }
         );
      }

      // Validasi pasien exists
      const existingPasien = await prisma.pasien.findUnique({
         where: { id: parseInt(pasien.id) },
      });

      if (!existingPasien) {
         return NextResponse.json(
            { success: false, error: "Pasien tidak ditemukan" },
            { status: 404 }
         );
      }

      // Siapkan data rekam medis
      const rekamMedisData: any = {
         pasienId: parseInt(pasien.id),
         dokterId: dokter.id,
         isi,
         tanggal: tanggal ? new Date(tanggal) : new Date(),
      };

      // Tambahkan pemeriksaanId jika ada
      if (pemeriksaanId) {
         rekamMedisData.pemeriksaanId = parseInt(pemeriksaanId);
      }

      // Buat rekam medis baru
      const newRekamMedis = await prisma.rekamMedis.create({
         data: rekamMedisData,
         include: {
            pasien: true,
            dokter: true,
            pemeriksaan: true,
         },
      });

      return NextResponse.json({
         success: true,
         data: newRekamMedis,
      });
   } catch (error) {
      console.error("Error creating rekam medis:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         if (error.code === "P2002") {
            return NextResponse.json(
               {
                  success: false,
                  error: "Pemeriksaan sudah memiliki rekam medis",
               },
               { status: 400 }
            );
         }
      }

      return NextResponse.json(
         { success: false, error: "Gagal membuat rekam medis" },
         { status: 500 }
      );
   }
}

// DELETE - Menghapus rekam medis
export async function DELETE(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
         return NextResponse.json(
            { success: false, error: "Unauthorized - User belum login" },
            { status: 401 }
         );
      }

      // Ambil ID dari URL atau body request
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (!id) {
         const body = await request.json();
         if (!body.id) {
            return NextResponse.json(
               { success: false, error: "ID rekam medis diperlukan" },
               { status: 400 }
            );
         }
      }

      const rekamMedisId = parseInt(id || (await request.json()).id);

      // Validasi apakah rekam medis exists
      const existingRekamMedis = await prisma.rekamMedis.findUnique({
         where: { id: rekamMedisId },
         include: {
            dokter: true,
            resep: true,
         },
      });

      if (!existingRekamMedis) {
         return NextResponse.json(
            { success: false, error: "Rekam medis tidak ditemukan" },
            { status: 404 }
         );
      }

      // Cek apakah user yang login adalah dokter yang membuat rekam medis
      const dokter = await prisma.dokter.findUnique({
         where: { userId: Number(session.user.id) },
      });

      if (!dokter) {
         return NextResponse.json(
            { success: false, error: "Dokter tidak ditemukan" },
            { status: 404 }
         );
      }

      // Validasi authorization - hanya dokter yang membuat yang bisa menghapus
      if (existingRekamMedis.dokterId !== dokter.id) {
         return NextResponse.json(
            {
               success: false,
               error: "Tidak memiliki izin untuk menghapus rekam medis ini",
            },
            { status: 403 }
         );
      }

      // Hapus resep yang terkait terlebih dahulu (jika ada)
      if (existingRekamMedis.resep.length > 0) {
         await prisma.resep.deleteMany({
            where: { rekamMedisId: rekamMedisId },
         });
      }

      // Hapus rekam medis
      await prisma.rekamMedis.delete({
         where: { id: rekamMedisId },
      });

      return NextResponse.json({
         success: true,
         message: "Rekam medis berhasil dihapus",
         data: { id: rekamMedisId },
      });
   } catch (error) {
      console.error("Error deleting rekam medis:", error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         if (error.code === "P2025") {
            return NextResponse.json(
               { success: false, error: "Rekam medis tidak ditemukan" },
               { status: 404 }
            );
         }
         if (error.code === "P2003") {
            return NextResponse.json(
               {
                  success: false,
                  error: "Tidak dapat menghapus rekam medis karena masih memiliki data terkait",
               },
               { status: 400 }
            );
         }
      }

      return NextResponse.json(
         { success: false, error: "Gagal menghapus rekam medis" },
         { status: 500 }
      );
   }
}
