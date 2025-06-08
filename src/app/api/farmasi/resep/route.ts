import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status") || undefined;
      const search = searchParams.get("search") || undefined;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any = {};

      if (status) {
         filters.status = status;
      }

      const resepList = await prisma.resep.findMany({
         where: {
            ...filters,
            ...(search && {
               OR: [
                  { obat: { nama: { contains: search, mode: "insensitive" } } },
                  {
                     dokter: {
                        nama: { contains: search, mode: "insensitive" },
                     },
                  },
                  {
                     rekamMedis: {
                        pasien: {
                           nama: { contains: search, mode: "insensitive" },
                        },
                     },
                  },
               ],
            }),
         },
         include: {
            dokter: {
               select: {
                  nama: true,
                  spesialisasi: true,
               },
            },
            obat: {
               select: {
                  nama: true,
                  stok: true,
                  satuan: true,
               },
            },
            rekamMedis: {
               include: {
                  pasien: {
                     select: {
                        nama: true,
                        noTelp: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            id: "desc",
         },
      });

      return NextResponse.json({ success: true, data: resepList });
   } catch (error) {
      console.error(error);
      return NextResponse.json(
         { success: false, message: "Error mengambil data resep" },
         { status: 500 }
      );
   }
}
