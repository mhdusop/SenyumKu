import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const dokter = await prisma.dokter.findMany({
         include: {
            pemeriksaan: true,
            rekamMedis: true,
         },
      });
      return NextResponse.json({ success: true, data: dokter });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, message: "Error" },
         { status: 500 }
      );
   }
}
