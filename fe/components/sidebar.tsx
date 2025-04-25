"use client"
import { CreditCard, DollarSign, Home, LayoutDashboard, School, Search, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      title: "Investments",
      icon: DollarSign,
      href: "/investments",
    },
    {
      title: "Credit",
      icon: CreditCard,
      href: "/credit",
    },
    {
      title: "Planning History",
      icon: School,
      href: "/planning-history",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <SidebarProvider>
      <ShadcnSidebar className="bg-black">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="font-semibold">Finance Dashboard</div>
          </div>
          <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <SidebarInput placeholder="Search payment..." className="pl-8" />
                <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </ShadcnSidebar>
    </SidebarProvider>
  )
}
