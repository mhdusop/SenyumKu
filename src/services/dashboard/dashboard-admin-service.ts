export interface DashboardData {
   summary: {
      userCount: number;
      pasienCount: number;
      dokterCount: number;
      obatCount: number;
      pendaftaranCount: number;
      pendingCount: number;
      todayRegistrations: number;
   };
   recentRegistrations: Array<{
      id: number;
      pasienId: number;
      tanggalDaftar: string;
      keluhan: string;
      status: string;
      pasien: {
         nama: string;
      };
   }>;
   statusData: {
      labels: string[];
      values: number[];
   };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
   const response = await fetch("/api/admin/dashboard", {
      method: "GET",
      headers: {
         "Content-Type": "application/json",
      },
   });

   if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
   }

   return await response.json();
};
