import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';
import { PaymentReportFilters } from "@/services/dokter/report-pembayaran-service";

interface FilterPembayaranProps {
   filters: PaymentReportFilters;
   onFilterChange: (key: keyof PaymentReportFilters, value: string | number) => void;
   onApplyFilters: () => void;
}

export function FilterPembayaran({
   filters,
   onFilterChange,
   onApplyFilters
}: FilterPembayaranProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Filter size={18} />
               Filter Laporan Pembayaran
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <label className="text-sm font-medium">Tanggal Awal</label>
                  <Input
                     type="date"
                     value={filters.startDate}
                     onChange={(e) => onFilterChange('startDate', e.target.value)}
                     className="mt-1"
                  />
               </div>
               <div>
                  <label className="text-sm font-medium">Tanggal Akhir</label>
                  <Input
                     type="date"
                     value={filters.endDate}
                     onChange={(e) => onFilterChange('endDate', e.target.value)}
                     className="mt-1"
                  />
               </div>
               <div>
                  <label className="text-sm font-medium">Metode Pembayaran</label>
                  <Select
                     value={filters.metode || 'ALL'}
                     onValueChange={(value) => onFilterChange('metode', value)}
                  >
                     <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Semua Metode" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="ALL">Semua Metode</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="TRANSFER">Transfer Bank</SelectItem>
                        <SelectItem value="DEBIT">Kartu Debit</SelectItem>
                        <SelectItem value="QRIS">QRIS</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="flex items-end">
                  <Button onClick={onApplyFilters} className="w-full">
                     Terapkan Filter
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}