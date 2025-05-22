"use client"

import React from "react"
import clsx from "clsx"
import { StatusType } from "@/interfaces/status"

interface StatusBadgeProps {
   status: StatusType
}

export function StatusBadge({ status }: StatusBadgeProps) {
   const statusMap: Record<StatusType, { label: string; color: string }> = {
      MENUNGGU: {
         label: "Menunggu",
         color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      },
      DIPERIKSA: {
         label: "Diperiksa",
         color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      },
      SELESAI: {
         label: "Selesai",
         color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      },
      DIBATALKAN: {
         label: "Dibatalkan",
         color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      },
   }

   const { label, color } = statusMap[status]

   return (
      <span
         className={clsx(
            "text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm",
            color
         )}
      >
         {label}
      </span>
   )
}