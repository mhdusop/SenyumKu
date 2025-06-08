import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
   try {
      const pasienList = await prisma.pendaftaran.findMany({
         where: {
            status: "MENUNGGU",
         },
         include: {
            pasien: true,
            antrian: true,
         },
         orderBy: {
            tanggalDaftar: "asc",
         },
      });

      return NextResponse.json({
         success: true,
         data: pasienList,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, error: "Failed to fetch daftar pasien" },
         { status: 500 }
      );
   }
}
