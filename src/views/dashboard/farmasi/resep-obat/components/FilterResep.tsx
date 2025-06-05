import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';

interface FilterResepProps {
   onFilterChange: (filters: { status?: string; search?: string }) => void;
}

export default function FilterResep({ onFilterChange }: FilterResepProps) {
   const [status, setStatus] = useState<string>('');
   const [search, setSearch] = useState<string>('');

   const handleFilter = () => {
      onFilterChange({
         status: status || undefined,
         search: search || undefined,
      });
   };

   const handleReset = () => {
      setStatus('');
      setSearch('');
      onFilterChange({});
   };

   return (
      <Card>
         <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
               <div className="flex-1">
                  <p className="text-sm mb-1">Status</p>
                  <Select value={status} onValueChange={setStatus}>
                     <SelectTrigger>
                        <SelectValue placeholder="Semua Status" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="BARU">Baru</SelectItem>
                        <SelectItem value="DIPROSES">Diproses</SelectItem>
                        <SelectItem value="SELESAI">Selesai</SelectItem>
                        <SelectItem value="DIBATALKAN">Dibatalkan</SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <div className="flex-1">
                  <p className="text-sm mb-1">Cari</p>
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                           placeholder="Cari obat atau pasien..."
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           className="pl-8"
                        />
                     </div>
                  </div>
               </div>

               <div className="flex items-end gap-2">
                  <Button onClick={handleFilter} className="flex-1">
                     <Filter className="mr-1 h-4 w-4" />
                     Filter
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                     Reset
                  </Button>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}