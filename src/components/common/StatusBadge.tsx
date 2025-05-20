// components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"
import { Status } from "@/interfaces/status"


type StatusBadgeProps = {
   status: Status
}

type BadgeVariant = "secondary" | "destructive" | "default" | "outline" | null | undefined;

const statusVariantMap: Record<Status, BadgeVariant> = {
   [Status.MENUNGGU]: "destructive",
   [Status.DIPERIKSA]: "default",
   [Status.SELESAI]: "secondary",
   [Status.DIBATALKAN]: "destructive",
}

export function StatusBadge({ status }: StatusBadgeProps) {
   const variant = statusVariantMap[status] ?? "secondary"

   return <Badge variant={variant}>{status}</Badge>
}