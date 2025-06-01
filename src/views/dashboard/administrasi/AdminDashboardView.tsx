'use client';

import { useEffect, useState } from 'react';
import { fetchDashboardData, DashboardData } from '@/services/dashboard/dashboard-admin-service';
import { showError } from '@/utils/toast';
import Loader from '@/components/common/Loader';
import { Users, UserCheck, Pill, ClipboardList, Clock, CalendarCheck } from 'lucide-react';
import { SummaryCard } from './components/SummaryCard';
import { RecentRegistrations } from './components/RecentRegistrations';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminDashboardView() {
   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const loadData = async () => {
         try {
            const data = await fetchDashboardData();
            setDashboardData(data);
         } catch (error) {
            console.error(error);
            showError('Gagal memuat data dashboard');
         } finally {
            setLoading(false);
         }
      };

      loadData();
   }, []);

   if (loading) return <Loader />;
   if (!dashboardData) return <div>Tidak ada data</div>;

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard Administrator</h1>
            <div className="text-muted-foreground">
               {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard
               title="Total Pengguna"
               value={dashboardData.summary.userCount}
               Icon={Users}
               iconColor="#60a5fa"
            />
            <SummaryCard
               title="Total Pasien"
               value={dashboardData.summary.pasienCount}
               Icon={UserCheck}
               iconColor="#60a5fa"
            />
            <SummaryCard
               title="Total Obat"
               value={dashboardData.summary.obatCount}
               Icon={Pill}
               iconColor="#60a5fa"
            />
            <SummaryCard
               title="Total Pendaftaran"
               value={dashboardData.summary.pendaftaranCount}
               Icon={ClipboardList}
               iconColor="#60a5fa"
            />
            <SummaryCard
               title="Menunggu Pemeriksaan"
               value={dashboardData.summary.pendingCount}
               Icon={Clock}
               iconColor="#60a5fa"
            />
            <SummaryCard
               title="Pendaftaran Hari Ini"
               value={dashboardData.summary.todayRegistrations}
               Icon={CalendarCheck}
               iconColor="#60a5fa"
            />
         </div>

         <RecentRegistrations registrations={dashboardData.recentRegistrations} />
      </div>
   );
}