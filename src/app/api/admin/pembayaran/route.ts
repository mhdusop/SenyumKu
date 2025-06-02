import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
