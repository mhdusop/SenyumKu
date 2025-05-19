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
          url: "#",
          icon: ContactRound
        },
        {
          title: "Data Pemeriksaan",
          url: "#",
          icon: ClipboardCheck
        },
        {
          title: "Data Pasien",
          url: "#",
          icon: UsersRound
        },
        {
          title: "Data Dokter",
          url: "#",
          icon: ShieldUser
        },
        {
          title: "Data Pembayaran",
          url: "#",
          icon: Wallet
        },
        {
          title: "Data Rekam Medis",
          url: "#",
          icon: ClipboardPlus
        },
        {
          title: "Data Obat",
          url: "#",
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
          url: "#",
          icon: Newspaper
        },
        {
          title: "Laporan Pembayaran",
          url: "#",
          icon: ReceiptText
        },
        {
          title: "Laporan Rekam Medis",
          url: "#",
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
          url: "#",
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
