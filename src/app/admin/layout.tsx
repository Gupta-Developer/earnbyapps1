
"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { Sidebar, SidebarProvider, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Users", icon: Users },
    { href: "/admin", label: "Tasks", icon: ListChecks },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AuthProvider>
        <SidebarProvider>
            <Sidebar collapsible="none">
                <SidebarContent>
                    <SidebarMenu>
                         {navItems.map((item) => (
                             <SidebarMenuItem key={item.label}>
                                <SidebarMenuButton asChild isActive={pathname === item.href}>
                                    <Link href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                         ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                 {children}
            </SidebarInset>
        </SidebarProvider>
    </AuthProvider>
  );
}
