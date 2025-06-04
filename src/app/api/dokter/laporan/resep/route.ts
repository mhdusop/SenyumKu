import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const startDate = searchParams.get("startDate");
   const endDate = searchParams.get("endDate");
   const dokterId = searchParams.get("dokterId");
   const obatId = searchParams.get("obatId");

   try {
      const filters: Record<string, unknown> = {};

      if (startDate && endDate) {
         filters.rekamMedis = {
            tanggal: {
               gte: new Date(startDate),
               lte: new Date(endDate),
            },
         };
      }

      if (dokterId) {
         filters.dokterId = parseInt(dokterId);
      }

      if (obatId) {
         filters.obatId = parseInt(obatId);
      }

      const prescriptions = await prisma.resep.findMany({
         where: filters,
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
                  satuan: true,
               },
            },
            rekamMedis: {
               include: {
                  pasien: {
                     select: {
                        nama: true,
                     },
                  },
               },
            },
         },
         orderBy: {
            id: "desc",
         },
      });

      const report = {
         totalPrescriptions: prescriptions.length,
         prescriptions: prescriptions.map((prescription) => ({
            id: prescription.id,
            dokter: prescription.dokter.nama,
            spesialisasi: prescription.dokter.spesialisasi || "-",
            obat: prescription.obat.nama,
            jumlah: prescription.jumlah,
            satuan: prescription.obat.satuan,
            aturan: prescription.aturan,
            pasien: prescription.rekamMedis?.pasien.nama || "-",
            tanggal: prescription.rekamMedis?.tanggal || null,
         })),
         statistics: [] as {
            obatId: number;
            nama: string;
            jumlahTotal: number;
            satuan: string;
         }[],
      };

      const obatStats = await prisma.resep.groupBy({
         by: ["obatId"],
         _sum: {
            jumlah: true,
         },
         where: filters,
      });

      const obatDetails = await prisma.obat.findMany({
         where: {
            id: {
               in: obatStats.map((stat) => stat.obatId),
            },
         },
         select: {
            id: true,
            nama: true,
            satuan: true,
         },
      });

      const statistics = obatStats.map((stat) => {
         const obat = obatDetails.find((o) => o.id === stat.obatId);
         return {
            obatId: stat.obatId,
            nama: obat?.nama || "",
            jumlahTotal: stat._sum.jumlah || 0,
            satuan: obat?.satuan || "",
         };
      });

      report.statistics = statistics;

      return NextResponse.json(report);
   } catch (error) {
      console.error("Error generating prescription report:", error);
      return NextResponse.json(
         { error: "Gagal membuat laporan resep" },
         { status: 500 }
      );
   }
}
