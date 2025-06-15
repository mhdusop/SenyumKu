import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { nama, stok, satuan } = body;

      if (!nama || !stok || !satuan) {
         return NextResponse.json(
            { success: false, error: "Semua field harus diisi." },
            { status: 400 }
         );
      }

      const newObat = await prisma.obat.create({
         data: {
            nama,
            stok: parseInt(stok, 10),
            satuan,
         },
      });

      return NextResponse.json({ success: true, data: newObat });
   } catch (error) {
      console.error("Error creating obat:", error);
      return NextResponse.json(
         { success: false, error: "Gagal menambahkan data obat." },
         { status: 500 }
      );
   }
}
