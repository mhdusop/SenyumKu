'use client'

import React from 'react'
import clsx from 'clsx'
import { RoleType } from '@/interfaces/role'

interface RoleBadgeProps {
   role: RoleType
}

export function RoleBadge({ role }: RoleBadgeProps) {
   const roleMap: Record<RoleType, { label: string; color: string }> = {
      PASIEN: {
         label: 'Pasien',
         color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      },
      DOKTER: {
         label: 'Dokter',
         color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      },
      ADMINISTRASI: {
         label: 'Administrasi',
         color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      },
      PENGELOLA_OBAT: {
         label: 'Pengelola Obat',
         color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      },
   }

   const { label, color } = roleMap[role]

   return (
      <span
         className={clsx(
            'text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm',
            color
         )}
      >
         {label}
      </span>
   )
}