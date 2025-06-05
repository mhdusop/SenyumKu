import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter } from 'lucide-react';
import { RekamMedisReportFilters } from "@/services/dokter/report-rekam-medis-service";

interface FilterRekamMedisProps {
   filters: RekamMedisReportFilters;
   onFilterChange: (key: keyof RekamMedisReportFilters, value: string | number | undefined) => void;
   onApplyFilters: () => void;
}

export function FilterRekamMedis({
   filters,
   onFilterChange,
   onApplyFilters
}: FilterRekamMedisProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Filter size={18} />
               Filter Laporan Rekam Medis
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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