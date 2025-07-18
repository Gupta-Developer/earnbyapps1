"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const AppLogo = () => (
  <Link href="/" className="flex items-center gap-2">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <rect width="32" height="32" rx="8" fill="currentColor"/>
      <path d="M10 10H16C18.2091 10 20 11.7909 20 14V22H10V10Z" fill="#1E1E1E" className="dark:fill-white"/>
      <path d="M22 10H16C13.7909 10 12 11.7909 12 14V22H22V10Z" fill="currentColor"/>
    </svg>
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
