import { AppSidebar } from "@/components/dashboard/app-sidebar"
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar"

interface DashboardProps {
   children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardProps) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1 cursor-pointer" />
               </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 p-4 bg-gray-100">
               <div>{children}</div>
            </main>
         </SidebarInset>
      </SidebarProvider>
   )
}