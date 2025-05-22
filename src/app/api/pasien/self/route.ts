import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
   const session = await getServerSession(authOptions);

   if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const pasien = await prisma.pasien.findUnique({
      where: {
         userId: Number(session.user.id),
      },
      include: {
         pendaftaran: {
            orderBy: {
               tanggalDaftar: "desc",
            },
            include: {
               antrian: true,
            },
         },
         pembayaran: {
            orderBy: {
               tanggal: "desc",
            },
         },
         pemeriksaan: {
            include: {
               dokter: true,
            },
         },
         rekamMedis: {
            include: {
               resep: {
                  include: {
                     obat: true,
                  },
               },
            },
         },
      },
   });

   if (!pasien) {
      return NextResponse.json(
         { error: "Pasien tidak ditemukan" },
         { status: 404 }
      );
   }

   return NextResponse.json(pasien);
}
