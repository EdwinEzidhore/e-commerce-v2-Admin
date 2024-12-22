"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"



const data = {
  navMain: [
    
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,

    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Add New Product",
          url: "/dashboard/products/create",
        },
        
      ],
    },
    {
      title: "Categories",
      url: "/dashboard/products/category",
      icon: SquareTerminal,
      items: [
        {
          title: "Add New Category",
          url: "/dashboard/products/category/create",
        },
        
      ],
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: SquareTerminal,
      
    },
    {
      title: "Banner",
      url: "/dashboard/banner",
      icon: BookOpen,
      items: [
        {
          title: "Blocked",
          url: "#",
        },
      ],
    },
    
  ],
  
  
}

export function AppSidebar({
  ...props
}) {

  const { data: session, status } = useSession();
    
  
  return (
    (<Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div
                  className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {status === "authenticated" && session.user && <NavUser user={session.user} />}
      </SidebarFooter>
    </Sidebar>)
  );
}
