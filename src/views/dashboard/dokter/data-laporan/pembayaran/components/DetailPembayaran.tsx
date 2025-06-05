import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from "@/utils/format-currency";

interface PembayaranItem {
   id: number;
   pasienNama: string;
   pasienId: number;
   jumlah: number;
   metode: string;
   tanggal: string;
   noTelp: string;
}

interface DetailPembayaranProps {
   pembayaran: PembayaranItem[];
}

export function DetailPembayaran({ pembayaran }: DetailPembayaranProps) {
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
            <CardTitle>Detail Pembayaran</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nama Pasien</TableHead>
                     <TableHead>No. Telp</TableHead>
                     <TableHead>Jumlah</TableHead>
                     <TableHead>Metode</TableHead>
                     <TableHead>Tanggal</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {pembayaran.length > 0 ? (
                     pembayaran.map((item) => (
                        <TableRow key={item.id}>
                           <TableCell>#{item.id}</TableCell>
                           <TableCell className="font-medium">{item.pasienNama}</TableCell>
                           <TableCell>{item.noTelp}</TableCell>
                           <TableCell>{formatCurrency(item.jumlah)}</TableCell>
                           <TableCell>{getNamaMetode(item.metode)}</TableCell>
                           <TableCell>
                              {format(new Date(item.tanggal), 'dd MMM yyyy', { locale: id })}
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                           Tidak ada data pembayaran
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}