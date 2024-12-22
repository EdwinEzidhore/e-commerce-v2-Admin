import React from 'react'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent } from '@/components/ui/card';



const Dashboardlayout = async ({ children }) => {

  const session = await getServerSession()

  if (!session) {
    redirect('/')
  }

  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="px-12 flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center justify-between gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-3 overflow-y-auto">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                  <div className="aspect-video rounded-xl bg-muted/50" />
                </div> */}
          <Card className='min-h-full w-full overflow-y-auto'>
            <CardContent className='p-0 flex-1 flex-grow rounded-xl bg-muted/50 h-full'>
            {children}
             
            </CardContent>
          </Card>

        </div>
      </SidebarInset>
    </SidebarProvider>

  )
}

export default Dashboardlayout