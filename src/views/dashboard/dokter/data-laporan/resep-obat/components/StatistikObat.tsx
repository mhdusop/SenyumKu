import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StatistikObatItem {
   obatId: number;
   nama: string;
   jumlahTotal: number;
   satuan: string;
}

interface StatistikObatProps {
   statistics: StatistikObatItem[];
}

export function StatistikObat({ statistics }: StatistikObatProps) {
   if (!statistics || statistics.length === 0) {
      return null;
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Statistik Obat</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Nama Obat</TableHead>
                     <TableHead className="text-right">Jumlah</TableHead>
                     <TableHead>Satuan</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {statistics.map((stat) => (
                     <TableRow key={stat.obatId}>
                        <TableCell className="font-medium">{stat.nama}</TableCell>
                        <TableCell className="text-right">{stat.jumlahTotal}</TableCell>
                        <TableCell>{stat.satuan}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}