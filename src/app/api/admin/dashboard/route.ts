import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
   try {
      const userCount = await prisma.user.count();
      const pasienCount = await prisma.pasien.count();
      const dokterCount = await prisma.dokter.count();
      const obatCount = await prisma.obat.count();
      const pendaftaranCount = await prisma.pendaftaran.count();

      const pendingCount = await prisma.pendaftaran.count({
         where: {
            status: "MENUNGGU",
         },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayRegistrations = await prisma.pendaftaran.count({
         where: {
            tanggalDaftar: {
               gte: today,
               lt: tomorrow,
            },
         },
      });

      const recentRegistrations = await prisma.pendaftaran.findMany({
         take: 5,
         orderBy: {
            tanggalDaftar: "desc",
         },
         include: {
            pasien: true,
         },
      });

      const statusCounts = await prisma.pendaftaran.groupBy({
         by: ["status"],
         _count: {
            status: true,
         },
      });

      const statusData: { labels: string[]; values: number[] } = {
         labels: [],
         values: [],
      };

      statusCounts.forEach((item) => {
         statusData.labels.push(item.status);
         statusData.values.push(item._count.status);
      });

      return NextResponse.json({
         summary: {
            userCount,
            pasienCount,
            dokterCount,
            obatCount,
            pendaftaranCount,
            pendingCount,
            todayRegistrations,
         },
         recentRegistrations,
         statusData,
      });
   } catch (error) {
      console.error("Dashboard API error:", error);
      return NextResponse.json(
         { error: "Failed to fetch dashboard data" },
         { status: 500 }
      );
   }
}
