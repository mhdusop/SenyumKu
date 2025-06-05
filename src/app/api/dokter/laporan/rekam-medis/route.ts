import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const startDate = searchParams.get("startDate");
   const endDate = searchParams.get("endDate");
   const dokterId = searchParams.get("dokterId");
   const pasienId = searchParams.get("pasienId");

   try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filters: any = {};

      if (startDate && endDate) {
         filters.tanggal = {
            gte: new Date(startDate),
            lte: new Date(endDate),
         };
      }

      if (dokterId) {
         filters.dokterId = parseInt(dokterId);
      }

      if (pasienId) {
         filters.pasienId = parseInt(pasienId);
      }

      const rekamMedis = await prisma.rekamMedis.findMany({
         where: filters,
         include: {
            pasien: {
               select: {
                  nama: true,
                  alamat: true,
                  noTelp: true,
               },
            },
            dokter: {
               select: {
                  nama: true,
                  spesialisasi: true,
               },
            },
            pemeriksaan: {
               select: {
                  keluhan: true,
                  diagnosa: true,
                  catatanTambahan: true,
               },
            },
         },
         orderBy: {
            tanggal: "desc",
         },
      });

      const diagnosisStats = await prisma.pemeriksaan.groupBy({
         by: ["diagnosa"],
         _count: {
            id: true,
         },
         where: {
            rekamMedis: {
               tanggal: filters.tanggal,
               dokterId: filters.dokterId,
               pasienId: filters.pasienId,
            },
         },
         orderBy: {
            _count: {
               id: "desc",
            },
         },
         take: 5,
      });

      const report = {
         totalRecords: rekamMedis.length,
         records: rekamMedis.map((record) => ({
            id: record.id,
            pasienId: record.pasienId,
            pasienNama: record.pasien.nama,
            pasienTelp: record.pasien.noTelp || "-",
            dokterId: record.dokterId,
            dokterNama: record.dokter.nama,
            spesialisasi: record.dokter.spesialisasi || "-",
            keluhan: record.pemeriksaan?.keluhan || "-",
            diagnosa: record.pemeriksaan?.diagnosa || "-",
            catatanTambahan: record.pemeriksaan?.catatanTambahan || "-",
            tanggal: record.tanggal,
            isi: record.isi,
         })),
         topDiagnoses: diagnosisStats.map((stat) => ({
            diagnosa: stat.diagnosa,
            jumlahKasus: stat._count.id,
         })),
      };

      return NextResponse.json(report);
   } catch (error) {
      console.error("Error generating rekam medis report:", error);
      return NextResponse.json(
         { error: "Gagal membuat laporan rekam medis" },
         { status: 500 }
      );
   }
}
