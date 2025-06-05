import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   try {
      const { searchParams } = new URL(request.url);
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: any = {};

      if (startDate && endDate) {
         filter.tanggal = {
            gte: new Date(startDate),
            lte: new Date(endDate),
         };
      }

      const pembayaran = await prisma.pembayaran.findMany({
         where: filter,
         include: {
            pasien: true,
         },
         orderBy: {
            tanggal: "desc",
         },
      });

      const totalAmount = pembayaran.reduce(
         (sum, payment) => sum + payment.jumlah,
         0
      );

      const report = {
         totalTransactions: pembayaran.length,
         totalAmount,
         payments: pembayaran.map((payment) => ({
            id: payment.id,
            pasienNama: payment.pasien.nama,
            pasienId: payment.pasienId,
            jumlah: payment.jumlah,
            metode: payment.metode,
            tanggal: payment.tanggal,
            noTelp: payment.pasien.noTelp || "-",
         })),
      };

      return NextResponse.json(report);
   } catch (error) {
      console.error("Error generating payment report:", error);
      return NextResponse.json(
         { error: "Gagal membuat laporan pembayaran" },
         { status: 500 }
      );
   }
}
