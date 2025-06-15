import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const body = await request.json();
      const { nama, stok, satuan } = body;

      if (!nama || !stok || !satuan) {
         return NextResponse.json(
            { success: false, error: "Semua field harus diisi." },
            { status: 400 }
         );
      }

      const updatedObat = await prisma.obat.update({
         where: { id: parseInt(params.id, 10) },
         data: {
            nama,
            stok: parseInt(stok, 10),
            satuan,
         },
      });

      return NextResponse.json({ success: true, data: updatedObat });
   } catch (error) {
      console.error("Error updating obat:", error);
      return NextResponse.json(
         { success: false, error: "Gagal memperbarui data obat." },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const deletedObat = await prisma.obat.delete({
         where: { id: parseInt(params.id) },
      });

      return NextResponse.json({ success: true, data: deletedObat });
   } catch (error) {
      console.error("Error deleting obat:", error);
      return NextResponse.json(
         { success: false, error: "Gagal menghapus data obat." },
         { status: 500 }
      );
   }
}
