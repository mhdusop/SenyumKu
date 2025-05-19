import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
   const data = await req.json();
   const { username, password, nama, alamat, noTelp } = data;

   if (!username || !password || !nama) {
      return NextResponse.json(
         { error: "Data tidak lengkap." },
         { status: 400 }
      );
   }

   const existingUser = await prisma.user.findUnique({ where: { username } });
   if (existingUser) {
      return NextResponse.json(
         { error: "Username sudah digunakan." },
         { status: 400 }
      );
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   await prisma.user.create({
      data: {
         username,
         password: hashedPassword,
         role: "PASIEN",
         pasien: {
            create: {
               nama,
               alamat,
               noTelp,
            },
         },
      },
   });

   return NextResponse.json({ success: true });
}
