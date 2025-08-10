
"use client";

import ActivityTicker from "@/components/activity-ticker";
import type { ReactNode } from "react";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4">
        <ActivityTicker />
        {children}
    </div>
  );
}
