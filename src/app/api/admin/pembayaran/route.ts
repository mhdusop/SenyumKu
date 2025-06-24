import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
   try {
      const pembayaran = await prisma.pembayaran.findMany({
         include: {
            pasien: true,
         },
      });
      return NextResponse.json({ success: true, data: pembayaran });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, message: "Error" },
         { status: 500 }
      );
   }
}

export async function POST(req: NextRequest) {
   try {
      const { pasienId, jumlah, tanggal, metode } = await req.json();

      const newPembayaran = await prisma.pembayaran.create({
         data: {
            pasienId: Number(pasienId),
            jumlah: Number(jumlah),
            tanggal: new Date(tanggal),
            metode,
         },
         include: {
            pasien: true,
         },
      });

      return NextResponse.json(
         { success: true, data: newPembayaran },
         { status: 201 }
      );
   } catch (error) {
      console.error("Error saat membuat pembayaran:", error);
      return NextResponse.json(
         {
            success: false,
            message: "Gagal membuat pembayaran",
         },
         { status: 500 }
      );
   }
}
