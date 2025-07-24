
"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";

const AppLogo = () => (
    <Link href="/" className="flex items-center gap-2" aria-label="EarnByApps Home">
        <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
        >
            <path 
                d="M6 8H18M6 13H18M10 3L10 21M6 3H12C14.2091 3 16 4.79086 16 7C16 9.20914 14.2091 11 12 11H6"
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
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
