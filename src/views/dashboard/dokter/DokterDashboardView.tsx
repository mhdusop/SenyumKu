'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
   Users,
   FileText,
   Activity,
   TrendingUp,
   Stethoscope,
   UserCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getDaftarPasien } from '@/services/dokter/daftar-pasien-service';
import { getRekamMedisList } from '@/services/dokter/rekam-medis-service';
import Loader from '@/components/common/Loader';

interface DashboardStats {
   totalPasien: number;
   totalRekamMedis: number;
   totalPemeriksaanHariIni: number;
   rekamMedisTerbaru: number;
}

interface PasienData {
   id: number;
   nama: string;
   alamat?: string;
   noTelp?: string;
}

interface RekamMedisData {
   id: number;
   isi: string;
   tanggal: string;
   pasien: {
      nama: string;
   };
   dokter: {
      nama: string;
   };
}

export default function DokterDashboardView() {
   const { data: session } = useSession();
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState<DashboardStats>({
      totalPasien: 0,
      totalRekamMedis: 0,
      totalPemeriksaanHariIni: 0,
      rekamMedisTerbaru: 0,
   });

   const [daftarPasien, setDaftarPasien] = useState<PasienData[]>([]);
   const [rekamMedisTerbaru, setRekamMedisTerbaru] = useState<RekamMedisData[]>([]);

   useEffect(() => {
      fetchDashboardData();
   }, []);

   const fetchDashboardData = async () => {
      try {
         setLoading(true);

         // Fetch data dari semua services
         const [pasienResponse, rekamMedisResponse] = await Promise.all([
            getDaftarPasien(),
            getRekamMedisList(),
         ]);

         // Set daftar pasien
         const pasienData = pasienResponse.data || [];
         setDaftarPasien(pasienData.slice(0, 5)); // Ambil 5 pasien terbaru

         // Set rekam medis terbaru
         const rekamMedisData = rekamMedisResponse || [];
         setRekamMedisTerbaru(rekamMedisData.slice(0, 5)); // Ambil 5 rekam medis terbaru

         // Hitung statistik
         const today = new Date().toDateString();
         const rekamMedisHariIni = rekamMedisData.filter((rm: RekamMedisData) =>
            new Date(rm.tanggal).toDateString() === today
         ).length;

         setStats({
            totalPasien: pasienData.length,
            totalRekamMedis: rekamMedisData.length,
            totalPemeriksaanHariIni: rekamMedisHariIni,
            rekamMedisTerbaru: rekamMedisData.length,
         });

      } catch (error) {
         console.error('Error fetching dashboard data:', error);
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return <Loader />;
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Dashboard Dokter</h1>
               <p className="text-gray-600 mt-1">
                  Selamat datang, Dr. {session?.user?.username || 'Dokter'}
               </p>
               <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('id-ID', {
                     weekday: 'long',
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric'
                  })}
               </p>
            </div>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPasien}</div>
                  <p className="text-xs text-muted-foreground">
                     Semua pasien terdaftar
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Rekam Medis</CardTitle>
                  <FileText className="h-4 w-4 text-green-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalRekamMedis}</div>
                  <p className="text-xs text-muted-foreground">
                     Semua rekam medis
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pemeriksaan Hari Ini</CardTitle>
                  <Stethoscope className="h-4 w-4 text-purple-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.totalPemeriksaanHariIni}</div>
                  <p className="text-xs text-muted-foreground">
                     Rekam medis hari ini
                  </p>
               </CardContent>
            </Card>

            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aktivitas</CardTitle>
                  <Activity className="h-4 w-4 text-orange-600" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">{stats.rekamMedisTerbaru}</div>
                  <p className="text-xs text-muted-foreground">
                     Total aktivitas
                  </p>
               </CardContent>
            </Card>
         </div>
         {/* Summary Card */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ringkasan Aktivitas
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                     <div className="text-2xl font-bold text-blue-600">{stats.totalPasien}</div>
                     <p className="text-sm text-blue-700">Total Pasien</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                     <div className="text-2xl font-bold text-green-600">{stats.totalRekamMedis}</div>
                     <p className="text-sm text-green-700">Total Rekam Medis</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                     <div className="text-2xl font-bold text-purple-600">{stats.totalPemeriksaanHariIni}</div>
                     <p className="text-sm text-purple-700">Pemeriksaan Hari Ini</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daftar Pasien Terbaru */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Users className="h-5 w-5" />
                     Daftar Pasien Terbaru
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {daftarPasien.length > 0 ? (
                        daftarPasien.map((pasien) => (
                           <div key={pasien.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <UserCheck className="h-4 w-4 text-blue-600" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-medium">{pasien.nama}</p>
                                    <p className="text-xs text-gray-600">
                                       {pasien.alamat || 'Alamat tidak tersedia'}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs text-gray-500">
                                    {pasien.noTelp || 'No. Telp tidak tersedia'}
                                 </p>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center text-gray-500 py-4">
                           Tidak ada data pasien
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Rekam Medis Terbaru */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <FileText className="h-5 w-5" />
                     Rekam Medis Terbaru
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {rekamMedisTerbaru.length > 0 ? (
                        rekamMedisTerbaru.map((rekamMedis) => (
                           <div key={rekamMedis.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-green-600" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-medium">{rekamMedis.pasien.nama}</p>
                                    <p className="text-xs text-gray-600 max-w-xs truncate">
                                       {rekamMedis.isi}
                                    </p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-xs text-gray-500">
                                    {new Date(rekamMedis.tanggal).toLocaleDateString('id-ID')}
                                 </p>
                                 <Badge variant="secondary" className="text-xs">
                                    {rekamMedis.dokter.nama}
                                 </Badge>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center text-gray-500 py-4">
                           Tidak ada rekam medis
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}