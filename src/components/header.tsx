
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
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
        >
            <path 
                d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM30 34H20C18.9 34 18 33.1 18 32V16C18 14.9 18.9 14 20 14H30C31.1 14 32 14.9 32 16V18H22V22H32V24H22V28H32V30H20V32H30V34Z" 
                fill="currentColor"
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
