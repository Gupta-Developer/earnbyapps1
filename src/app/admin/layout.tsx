
"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
}
