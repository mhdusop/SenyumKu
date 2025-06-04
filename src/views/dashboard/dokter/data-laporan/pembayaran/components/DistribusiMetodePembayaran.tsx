import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format-currency";

interface DistribusiMetode {
   metode: string;
   jumlahTotal: number;
   jumlahTransaksi: number;
}

interface DistribusiMetodePembayaranProps {
   distribusi: DistribusiMetode[];
}

export function DistribusiMetodePembayaran({ distribusi }: DistribusiMetodePembayaranProps) {
   if (!distribusi || distribusi.length === 0) {
      return null;
   }

   // Map metode pembayaran ke nama yang lebih user-friendly
   const getNamaMetode = (metode: string) => {
      switch (metode) {
         case 'CASH': return 'Tunai';
         case 'TRANSFER': return 'Transfer Bank';
         case 'DEBIT': return 'Kartu Debit';
         case 'QRIS': return 'QRIS';
         default: return metode;
      }
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Distribusi Metode Pembayaran</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Metode Pembayaran</TableHead>
                     <TableHead>Jumlah Transaksi</TableHead>
                     <TableHead className="text-right">Total</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {distribusi.map((item) => (
                     <TableRow key={item.metode}>
                        <TableCell className="font-medium">{getNamaMetode(item.metode)}</TableCell>
                        <TableCell>{item.jumlahTransaksi}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.jumlahTotal)}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}