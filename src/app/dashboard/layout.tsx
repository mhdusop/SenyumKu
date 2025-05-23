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
         <div className="flex h-screen w-screen overflow-hidden">
            <AppSidebar />
            <SidebarInset className="flex flex-col flex-1 overflow-hidden">
               <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
                  <SidebarTrigger className="-ml-1 cursor-pointer" />
               </header>
               <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
                  {children}
               </main>
            </SidebarInset>
         </div>
      </SidebarProvider>
   )
}