
"use client";

import ActivityTicker from "@/components/activity-ticker";
import type { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <ActivityTicker />
        <main className="container mx-auto px-4 max-w-7xl pb-20">
            {children}
        </main>
    </div>
  );
}
