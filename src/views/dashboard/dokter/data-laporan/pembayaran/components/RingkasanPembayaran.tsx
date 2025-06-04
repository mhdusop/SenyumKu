import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";

interface RingkasanPembayaranProps {
   totalTransaksi: number;
   totalJumlah: number;
}

export function RingkasanPembayaran({ totalTransaksi, totalJumlah }: RingkasanPembayaranProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Transaksi</div>
                  <div className="text-2xl font-bold mt-1">{totalTransaksi}</div>
               </div>
               <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Pembayaran</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(totalJumlah)}</div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}