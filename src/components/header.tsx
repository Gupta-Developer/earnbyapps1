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
      <path d="M12 22V10H14.4V14.4H18.6C20.4778 14.4 22 15.9222 22 17.8C22 19.6778 20.4778 21.2 18.6 21.2H14.4V22H12ZM14.4 19.2H18.6C19.3719 19.2 20 18.5719 20 17.8C20 17.0281 19.3719 16.4 18.6 16.4H14.4V19.2Z" fill="#FFFFFF" className="dark:fill-white fill-primary-foreground"/>
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
