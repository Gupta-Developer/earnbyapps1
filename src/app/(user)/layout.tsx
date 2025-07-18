import type { ReactNode } from "react";
import BottomNav from "@/components/bottom-nav";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center bg-background">
      <div className="w-full max-w-[480px] min-h-screen bg-card shadow-lg relative flex flex-col">
        <main className="flex-grow pb-20">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
