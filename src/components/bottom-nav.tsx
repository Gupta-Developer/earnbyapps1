
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Wallet2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet2 },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-card/80 backdrop-blur-sm border-t shadow-t-lg md:hidden z-30">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors w-20",
                isActive ? "text-primary" : "hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        {user && isAdmin && (
           <Link
              href="/admin"
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors w-20",
                pathname.startsWith('/admin') ? "text-primary" : "hover:text-primary"
              )}
            >
              <Shield className="h-6 w-6" />
              <span className="text-xs font-medium">Admin</span>
            </Link>
        )}
      </div>
    </nav>
  );
}
