// app/api/users/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
   const users = await prisma.user.findMany({
      where: {
         role: {
            not: "PASIEN",
         },
      },
      include: {
         dokter: true,
         staffAdministrasi: true,
         staffPengelolaObat: true,
      },
   });
   return NextResponse.json(users);
}

export async function POST(request: Request) {
   const body = await request.json();
   const { username, password, role, profile } = body;

   if (!profile || !profile.nama) {
      return NextResponse.json(
         { error: "Profile dengan nama wajib diisi" },
         { status: 400 }
      );
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   try {
      const user = await prisma.user.create({
         data: {
            username,
            password: hashedPassword,
            role,
            ...(role === "DOKTER" && {
               dokter: {
                  create: {
                     nama: profile.nama,
                     noTelp: profile.noTelp || "",
                     spesialisasi: profile.spesialisasi || null,
                  },
               },
            }),
            ...(role === "ADMINISTRASI" && {
               staffAdministrasi: {
                  create: {
                     nama: profile.nama,
                  },
               },
            }),
            ...(role === "PENGELOLA_OBAT" && {
               staffPengelolaObat: {
                  create: {
                     nama: profile.nama,
                  },
               },
            }),
         },
      });

      return NextResponse.json(user);
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { error: "Gagal membuat user", detail: error },
         { status: 500 }
      );
   }
}
