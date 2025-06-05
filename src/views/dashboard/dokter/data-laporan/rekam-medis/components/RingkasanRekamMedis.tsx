import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DiagnosisStatistic } from "@/services/dokter/report-rekam-medis-service";

interface RingkasanRekamMedisProps {
   totalRecords: number;
   topDiagnoses: DiagnosisStatistic[];
}

export function RingkasanRekamMedis({
   totalRecords,
   topDiagnoses
}: RingkasanRekamMedisProps) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card>
            <CardHeader>
               <CardTitle>Ringkasan Rekam Medis</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Rekam Medis</div>
                  <div className="text-2xl font-bold mt-1">{totalRecords}</div>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Diagnosa Terbanyak</CardTitle>
            </CardHeader>
            <CardContent>
               {topDiagnoses.length > 0 ? (
                  <ul className="space-y-2">
                     {topDiagnoses.map((item, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                           <span className="font-medium">{item.diagnosa}</span>
                           <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {item.jumlahKasus} kasus
                           </span>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <p className="text-muted-foreground text-center py-4">
                     Tidak ada data diagnosa tersedia
                  </p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}