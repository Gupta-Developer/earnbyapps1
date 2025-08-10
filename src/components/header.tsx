
"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { IndianRupee, Shield, Home, Wallet2, User } from "lucide-react";

const AppLogo = () => (
    <Link href="/" className="flex items-center gap-2" aria-label="EarnByApps Home">
        <IndianRupee className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">EarnByApps</span>
    </Link>
);

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet2 },
  { href: "/profile", label: "Profile", icon: User },
];

function AuthContent() {
    const { isAdmin } = useAuth();
    return (
        <>
        {isAdmin && (
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin</span>
                </Link>
            </Button>
        )}
        </>
    )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-4 max-w-5xl mx-auto">
        <AppLogo />
        <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-4">
                 {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <AuthContent />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
