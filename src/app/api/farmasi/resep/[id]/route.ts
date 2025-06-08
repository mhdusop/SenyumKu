import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const id = parseInt(params.id);

      const resep = await prisma.resep.findUnique({
         where: { id },
         include: {
            dokter: {
               select: {
                  id: true,
                  nama: true,
                  spesialisasi: true,
               },
            },
            obat: {
               select: {
                  id: true,
                  nama: true,
                  stok: true,
                  satuan: true,
               },
            },
            rekamMedis: {
               include: {
                  pasien: {
                     select: {
                        id: true,
                        nama: true,
                        noTelp: true,
                        alamat: true,
                     },
                  },
                  pemeriksaan: {
                     select: {
                        keluhan: true,
                        diagnosa: true,
                        catatanTambahan: true,
                     },
                  },
               },
            },
         },
      });

      if (!resep) {
         return NextResponse.json(
            { success: false, message: "Resep tidak ditemukan" },
            { status: 404 }
         );
      }

      return NextResponse.json({ success: true, data: resep });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, message: "Error mengambil detail resep" },
         { status: 500 }
      );
   }
}

// Update status resep (misalnya menjadi 'diproses' atau 'selesai')
export async function PUT(
   request: Request,
   { params }: { params: { id: string } }
) {
   try {
      const id = parseInt(params.id);
      const data = await request.json();

      // Memproses resep dan mengurangi stok obat jika status 'selesai'
      if (data.status === "SELESAI") {
         // Mulai transaksi untuk memastikan stok obat dan status resep diupdate bersama
         const result = await prisma.$transaction(async (tx) => {
            // Dapatkan resep dan obat terkait
            const resep = await tx.resep.findUnique({
               where: { id },
               include: { obat: true },
            });

            if (!resep) {
               throw new Error("Resep tidak ditemukan");
            }

            // Pastikan stok mencukupi
            if (resep.obat.stok < resep.jumlah) {
               throw new Error("Stok obat tidak mencukupi");
            }

            // Kurangi stok obat
            await tx.obat.update({
               where: { id: resep.obatId },
               data: { stok: resep.obat.stok - resep.jumlah },
            });

            return await tx.resep.update({
               where: { id },
               data: {},
            });
         });

         return NextResponse.json({
            success: true,
            message: "Resep berhasil diproses",
            data: result,
         });
      }

      const updatedResep = await prisma.resep.update({
         where: { id },
         data: data,
      });

      return NextResponse.json({
         success: true,
         message: "Resep berhasil diperbarui",
         data: updatedResep,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         {
            success: false,
            message:
               error instanceof Error
                  ? error.message
                  : "Error memperbarui resep",
         },
         { status: 500 }
      );
   }
}
