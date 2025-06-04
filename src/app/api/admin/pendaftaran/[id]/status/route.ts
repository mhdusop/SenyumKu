import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
   request: Request,
   { params }: { params: { id: string } }
) {
   const id = parseInt(params.id);
   const { status } = await request.json();

   const allowedStatuses = ["MENUNGGU", "DIPERIKSA", "SELESAI", "DIBATALKAN"];
   if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
         { success: false, message: "Status tidak valid." },
         { status: 400 }
      );
   }

   try {
      const updated = await prisma.pendaftaran.update({
         where: { id },
         data: { status },
      });

      return NextResponse.json({ success: true, data: updated });
   } catch (error) {
      console.error("Gagal mengubah status pendaftaran:", error);
      return NextResponse.json(
         { success: false, message: "Terjadi kesalahan pada server." },
         { status: 500 }
      );
   }
}
