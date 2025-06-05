import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RekamMedisRecord } from "@/services/dokter/report-rekam-medis-service";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface TabelRekamMedisProps {
   records: RekamMedisRecord[];
}

export function TabelRekamMedis({ records }: TabelRekamMedisProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Data Rekam Medis</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Tanggal</TableHead>
                     <TableHead>Pasien</TableHead>
                     <TableHead>Dokter</TableHead>
                     <TableHead>Keluhan</TableHead>
                     <TableHead>Diagnosa</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {records.length > 0 ? (
                     records.map((record) => (
                        <TableRow key={record.id}>
                           <TableCell>
                              {format(new Date(record.tanggal), 'dd MMM yyyy', { locale: id })}
                           </TableCell>
                           <TableCell>{record.pasienNama}</TableCell>
                           <TableCell>{record.dokterNama}</TableCell>
                           <TableCell className="max-w-[200px] truncate">{record.keluhan}</TableCell>
                           <TableCell>{record.diagnosa}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                           Tidak ada data rekam medis
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}