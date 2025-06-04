import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ResepItem {
   id: number;
   dokter: string;
   pasien: string;
   obat: string;
   jumlah: number;
   satuan: string;
   aturan: string;
   tanggal: string | null;
}

interface DetailResepProps {
   prescriptions: ResepItem[];
}

export function DetailResep({ prescriptions }: DetailResepProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Detail Resep</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Dokter</TableHead>
                     <TableHead>Pasien</TableHead>
                     <TableHead>Obat</TableHead>
                     <TableHead>Jumlah</TableHead>
                     <TableHead>Aturan</TableHead>
                     <TableHead>Tanggal</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {prescriptions.length > 0 ? (
                     prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                           <TableCell>{prescription.dokter}</TableCell>
                           <TableCell>{prescription.pasien}</TableCell>
                           <TableCell>{prescription.obat}</TableCell>
                           <TableCell>{prescription.jumlah} {prescription.satuan}</TableCell>
                           <TableCell>{prescription.aturan}</TableCell>
                           <TableCell>
                              {prescription.tanggal ?
                                 format(new Date(prescription.tanggal), 'dd MMM yyyy', { locale: id }) :
                                 '-'
                              }
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                           Tidak ada data resep
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}