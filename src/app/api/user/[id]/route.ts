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
      await prisma.user.delete({ where: { id } });
      return NextResponse.json({ message: "User deleted" });
   } catch (error) {
      return NextResponse.json(
         { error: "Gagal menghapus user", detail: error },
         { status: 500 }
      );
   }
}
