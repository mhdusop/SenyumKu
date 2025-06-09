"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
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
  Tablets,
  LayoutDashboard,
  ClipboardPen,
  BookUser,
  Stethoscope
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

const dashboardPathMap: Record<string, string> = {
  PASIEN: "/dashboard/pasien",
  DOKTER: "/dashboard/dokter",
  PENGELOLA_OBAT: "/dashboard/farmasi",
  ADMINISTRASI: "/dashboard/administrasi",
};

const fullNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Master Data",
    url: "#",
    icon: Database,
    items: [
      { title: "Data Pendaftaran", url: "/dashboard/administrasi/master/pendaftaran", icon: ContactRound },
      { title: "Data Pemeriksaan", url: "/dashboard/administrasi/master/pemeriksaan", icon: ClipboardCheck },
      { title: "Data User", url: "/dashboard/administrasi/master/user", icon: BookUser },
      { title: "Data Pasien", url: "/dashboard/administrasi/master/pasien", icon: UsersRound },
      { title: "Data Dokter", url: "/dashboard/administrasi/master/dokter", icon: ShieldUser },
      { title: "Data Pembayaran", url: "/dashboard/administrasi/master/pembayaran", icon: Wallet },
      { title: "Data Rekam Medis", url: "/dashboard/administrasi/master/rekam-medis", icon: ClipboardPlus },
    ],
  },
  {
    title: "Data Laporan",
    url: "#",
    icon: ClipboardMinus,
    items: [
      { title: "Laporan Resep", url: "/dashboard/dokter/data-laporan/resep", icon: Newspaper },
      { title: "Laporan Pembayaran", url: "/dashboard/dokter/data-laporan/pembayaran", icon: ReceiptText },
      { title: "Laporan Rekam Medis", url: "/dashboard/dokter/data-laporan/rekam-medis", icon: FilePlus },
    ],
  },
  {
    title: "Kelola Obat",
    url: "#",
    icon: PillBottle,
    items: [
      { title: "Resep Obat", url: "/dashboard/farmasi/resep-obat", icon: Tablets },
      { title: "Data Obat", url: "/dashboard/farmasi/data-obat", icon: Pill },
    ],
  },
];

const getNavMainByRole = (role?: string) => {
  const dashboardUrl = dashboardPathMap[role ?? ""] ?? "/dashboard";

  const dashboardItem = {
    title: "Dashboard",
    url: dashboardUrl,
    icon: LayoutDashboard,
  };

  const formPendaftaran = {
    title: "Form Pendaftaran",
    url: `${dashboardUrl}/daftar`,
    icon: ClipboardPen
  };

  const daftarPasien = {
    title: "Daftar Pasien",
    url: `${dashboardUrl}/daftar-pasien`,
    icon: UsersRound
  }

  const pemeriksaanPasien = {
    title: "Pemeriksaan Pasien",
    url: `${dashboardUrl}/pemeriksaan-pasien`,
    icon: Stethoscope
  }

  const rekamMedis = {
    title: "Rekam Medis",
    url: `${dashboardUrl}/rekam-medis`,
    icon: ClipboardPlus
  }

  switch (role) {
    case "PASIEN":
      return [dashboardItem, formPendaftaran];

    case "DOKTER":
      return [
        dashboardItem,
        daftarPasien,
        pemeriksaanPasien,
        rekamMedis,
        {
          ...fullNavMain[2], // Data Laporan
          items: fullNavMain[2].items?.map(item => ({
            ...item,
            url: item.url.replace("/dashboard/dokter", dashboardUrl),
          })) ?? [],
        },
      ];

    case "PENGELOLA_OBAT":
      return [
        dashboardItem,
        {
          ...fullNavMain[3], // Farmasi
          items: fullNavMain[3].items?.map(item => ({
            ...item,
            url: item.url.replace("/dashboard/farmasi", dashboardUrl),
          })),
        },
      ];

    case "ADMINISTRASI":
      return [
        dashboardItem,
        {
          ...fullNavMain[1], // Master Data
          items: fullNavMain[1].items?.filter(item =>
            [
              "pendaftaran",
              "pemeriksaan",
              "user",
              "pasien",
              "dokter",
              "pembayaran",
              "rekam-medis",
            ].some((segment) => item.url.endsWith(segment))
          ),
        },
      ];

    default:
      return [dashboardItem];
  }
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const role = session?.user?.role as string | undefined

  const navMain = getNavMainByRole(role);

  const user = {
    name: session?.user?.username ?? "Guest",
    role: session?.user?.role ?? "-",
    avatar: "/avatars/default.jpg",
  }

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
            <span className="truncate text-[10px]">Klinik Dokter Gigi</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}