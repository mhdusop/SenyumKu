import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Registration {
   id: number;
   pasien: { nama: string };
   tanggalDaftar: string;
   keluhan: string;
   status: string;
}

interface RecentRegistrationsProps {
   registrations: Registration[];
}

const getStatusBadge = (status: string) => {
   const statusMap = {
      'MENUNGGU': { text: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
      'DIPERIKSA': { text: 'Diperiksa', className: 'bg-blue-100 text-blue-800' },
      'SELESAI': { text: 'Selesai', className: 'bg-green-100 text-green-800' },
      'DIBATALKAN': { text: 'Dibatalkan', className: 'bg-red-100 text-red-800' },
   };

   const badgeInfo = statusMap[status as keyof typeof statusMap] || { text: status, className: '' };

   return <Badge variant="outline" className={badgeInfo.className}>{badgeInfo.text}</Badge>;
};

export function RecentRegistrations({ registrations }: RecentRegistrationsProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Pendaftaran Terbaru</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Pasien</TableHead>
                     <TableHead>Tanggal</TableHead>
                     <TableHead>Keluhan</TableHead>
                     <TableHead>Status</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {registrations.length > 0 ? (
                     registrations.map((registration) => (
                        <TableRow key={registration.id}>
                           <TableCell className="font-medium">{registration.pasien.nama}</TableCell>
                           <TableCell>
                              {format(new Date(registration.tanggalDaftar), 'dd MMMM yyyy', { locale: id })}
                           </TableCell>
                           <TableCell className="max-w-[200px] truncate">{registration.keluhan}</TableCell>
                           <TableCell>{getStatusBadge(registration.status)}</TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                           Tidak ada pendaftaran terbaru
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
}