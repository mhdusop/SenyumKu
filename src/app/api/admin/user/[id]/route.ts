import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
   _: Request,
   context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params;
   const parsedId = parseInt(id);
   const user = await prisma.user.findUnique({
      where: { id: parsedId },
      include: {
         pasien: true,
         dokter: true,
         staffAdministrasi: true,
         staffPengelolaObat: true,
      },
   });

   return NextResponse.json(user);
}

export async function PUT(
   request: Request,
   context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params;
   const parsedId = parseInt(id);
   const data = await request.json();

   try {
      const user = await prisma.user.update({
         where: { id: parsedId },
         data: {
            username: data.username,
            password: data.password,
            role: data.role,
         },
      });

      return NextResponse.json(user);
   } catch (error) {
      return NextResponse.json(
         { error: "Gagal mengubah user", detail: error },
         { status: 500 }
      );
   }
}

export async function DELETE(
   _: Request,
   context: { params: Promise<{ id: string }> }
) {
   const { id } = await context.params;
   const parsedId = parseInt(id);

   try {
      const user = await prisma.user.findUnique({
         where: { id: parsedId },
         select: { role: true },
      });

      if (!user) {
         return NextResponse.json(
            { error: "User tidak ditemukan" },
            { status: 404 }
         );
      }

      if (user.role === "ADMINISTRASI") {
         return NextResponse.json(
            { error: "User administrasi tidak dapat dihapus" },
            { status: 403 }
         );
      }

      if (user.role === "PASIEN") {
         await prisma.pasien.delete({ where: { userId: parsedId } });
      } else if (user.role === "DOKTER") {
         await prisma.dokter.delete({ where: { userId: parsedId } });
      } else if (user.role === "PENGELOLA_OBAT") {
         await prisma.stafPengelolaObat.delete({ where: { userId: parsedId } });
      }

      await prisma.user.delete({ where: { id: parsedId } });

      return NextResponse.json({ message: "User berhasil dihapus" });
   } catch (error) {
      return NextResponse.json(
         { error: "Gagal menghapus user", detail: error },
         { status: 500 }
      );
   }
}
