
"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { IndianRupee, Shield } from "lucide-react";

const AppLogo = () => (
    <Link href="/" className="flex items-center gap-2" aria-label="EarnByApps Home">
        <IndianRupee className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">EarnByApps</span>
    </Link>
);


export default function Header() {
  const { isAdmin } = useAuth();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <AppLogo />
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin</span>
              </Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
