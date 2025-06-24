import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
   req: Request,
   { params }: { params: { id: string } }
) {
   try {
      const id = Number(params.id);
      const body = await req.json();
      const { pasienId, jumlah, tanggal, metode } = body;

      const updatedPembayaran = await prisma.pembayaran.update({
         where: { id },
         data: {
            pasienId,
            jumlah,
            tanggal: new Date(tanggal),
            metode,
         },
      });

      return NextResponse.json({ success: true, data: updatedPembayaran });
   } catch (error) {
      console.error("Error updating pembayaran:", error);
      return NextResponse.json(
         { success: false, message: "Error updating pembayaran" },
         { status: 500 }
      );
   }
}

export async function DELETE(
   req: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params;

   if (req.method === "DELETE") {
      try {
         await prisma.pembayaran.delete({
            where: { id: Number(id) },
         });

         return new NextResponse(null, { status: 204 }); // No Content
      } catch (error) {
         console.error("Error deleting pembayaran:", error);
         return NextResponse.json(
            { success: false, message: "Gagal menghapus pembayaran" },
            { status: 500 }
         );
      }
   } else {
      return new NextResponse(`Method ${req.method} Not Allowed`, {
         status: 405,
         headers: { Allow: "DELETE" },
      });
   }
}
