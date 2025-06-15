import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
   try {
      const obatList = await prisma.obat.findMany({
         select: {
            id: true,
            nama: true,
            satuan: true,
            stok: true,
         },
      });

      return NextResponse.json({ data: obatList });
   } catch (error) {
      console.error("Error fetching daftar obat:", error);
      return NextResponse.json(
         { success: false, error: "Gagal mengambil daftar obat." },
         { status: 500 }
      );
   }
}
