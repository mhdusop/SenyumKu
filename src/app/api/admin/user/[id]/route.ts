// app/api/user/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
   const id = parseInt(params.id);
   const user = await prisma.user.findUnique({
      where: { id },
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
   { params }: { params: { id: string } }
) {
   const id = parseInt(params.id);
   const data = await request.json();

   try {
      const user = await prisma.user.update({
         where: { id },
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
   { params }: { params: { id: string } }
) {
   const id = parseInt(params.id);

   try {
      const user = await prisma.user.findUnique({
         where: { id },
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
         await prisma.pasien.delete({ where: { userId: id } });
      } else if (user.role === "DOKTER") {
         await prisma.dokter.delete({ where: { userId: id } });
      } else if (user.role === "PENGELOLA_OBAT") {
         await prisma.stafPengelolaObat.delete({ where: { userId: id } });
      }

      await prisma.user.delete({ where: { id } });

      return NextResponse.json({ message: "User berhasil dihapus" });
   } catch (error) {
      return NextResponse.json(
         { error: "Gagal menghapus user", detail: error },
         { status: 500 }
      );
   }
}
