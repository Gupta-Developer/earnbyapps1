
"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { Sidebar, SidebarProvider, SidebarInset, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  
  return (
    <AuthProvider>
        <SidebarProvider>
            {!isMobile && (
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
            )}
            <SidebarInset>
                 {children}
            </SidebarInset>
        </SidebarProvider>
    </AuthProvider>
  );
}

    