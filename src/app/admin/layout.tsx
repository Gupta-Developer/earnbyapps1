
"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
        <SidebarProvider>
            <Sidebar>
                {/* You can add sidebar content here if it should be static across all admin pages */}
            </Sidebar>
            <SidebarInset>
                 {children}
            </SidebarInset>
        </SidebarProvider>
    </AuthProvider>
  );
}
