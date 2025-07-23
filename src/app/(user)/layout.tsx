
"use client";

import type { ReactNode } from "react";
import BottomNav from "@/components/bottom-nav";
import Header from "@/components/header";
import { AuthProvider } from "@/hooks/use-auth";
import Footer from "@/components/footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
        {children}
    </>
  );
}
