import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
   title: string;
   value: number | string;
   Icon: LucideIcon;
   iconColor?: string;
}

export function SummaryCard({ title, value, Icon, iconColor }: SummaryCardProps) {
   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <Icon className="text-muted-foreground" size={26} style={iconColor ? { color: iconColor } : {}} />
         </CardHeader>
         <CardContent>
            <div className="text-3xl font-bold">{value}</div>
         </CardContent>
      </Card>
   );
}