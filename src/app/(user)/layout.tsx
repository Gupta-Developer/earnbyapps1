import type { ReactNode } from "react";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center bg-background">
      <div className="w-full max-w-[480px] min-h-screen bg-card shadow-lg relative flex flex-col">
        <Header />
        <main className="flex-grow pt-16 pb-20">{children}</main>
        <Footer />
        <BottomNav />
      </div>
    </div>
  );
}
