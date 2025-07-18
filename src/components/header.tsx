"use client";

import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-2xl font-bold text-foreground">EarnByApps</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
