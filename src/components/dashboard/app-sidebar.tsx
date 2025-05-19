"use client"

import * as React from "react"
import {
  PillBottle,
  Database,
  ContactRound,
  ClipboardCheck,
  UsersRound,
  ShieldUser,
  Wallet,
  ClipboardPlus,
  ClipboardMinus,
  Pill,
  Newspaper,
  ReceiptText,
  FilePlus,
  Tablets
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Master Data",
      url: "#",
      icon: Database,
      isActive: true,
      items: [
        {
          title: "Data Pendaftaran",
          url: "/dashboard/master-data/pendaftaran",
          icon: ContactRound
        },
        {
          title: "Data Pemeriksaan",
          url: "/dashboard/master-data/pemeriksaan",
          icon: ClipboardCheck
        },
        {
          title: "Data Pasien",
          url: "/dashboard/master-data/pasien",
          icon: UsersRound
        },
        {
          title: "Data Dokter",
          url: "/dashboard/master-data/dokter",
          icon: ShieldUser
        },
        {
          title: "Data Pembayaran",
          url: "/dashboard/master-data/pembayaran",
          icon: Wallet
        },
        {
          title: "Data Rekam Medis",
          url: "/dashboard/master-data/rekam-medis",
          icon: ClipboardPlus
        },
        {
          title: "Data Obat",
          url: "/dashboard/master-data/obat",
          icon: Pill
        },
      ],
    },
    {
      title: "Data Laporan",
      url: "#",
      icon: ClipboardMinus,
      items: [
        {
          title: "Laporan Resep",
          url: "/dashboard/data-laporan/resep",
          icon: Newspaper
        },
        {
          title: "Laporan Pembayaran",
          url: "/dashboard/data-laporan/pembayaran",
          icon: ReceiptText
        },
        {
          title: "Laporan Rekam Medis",
          url: "/dashboard/data-laporan/rekam-medis",
          icon: FilePlus
        },
      ],
    },
    {
      title: "Kelola Obat",
      url: "#",
      icon: PillBottle,
      items: [
        {
          title: "Resep Obat",
          url: "/dashboard/kelola-obat/resep-obat",
          icon: Tablets
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <h1 className="text-2xl font-bold text-white">K</h1>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">SenyumKu</span>
            <span className="truncate text-xs">Klinik Dokter Gigi</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
