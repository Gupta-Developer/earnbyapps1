
"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const AppLogo = () => (
  <Link href="/" className="flex items-center gap-2">
    <span className="text-xl font-bold text-foreground">EarnByApps</span>
  </Link>
);

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <AppLogo />
        <ThemeToggle />
      </div>
    </header>
  );
}
