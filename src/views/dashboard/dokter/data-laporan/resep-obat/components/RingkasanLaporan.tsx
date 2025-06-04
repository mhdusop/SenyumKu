import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RingkasanLaporanProps {
   totalResep: number;
}

export function RingkasanLaporan({ totalResep }: RingkasanLaporanProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Resep Obat</div>
                  <div className="text-2xl font-bold mt-1">{totalResep || 0}</div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}