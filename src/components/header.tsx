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
      <path d="M6 4C4.89543 4 4 4.89543 4 6V26C4 27.1046 4.89543 28 6 28H26C27.1046 28 28 27.1046 28 26V6C28 4.89543 27.1046 4 26 4H6Z" fill="currentColor"/>
      <path d="M11.5366 22.4635L19.5 16.0001L11.5366 9.53674V22.4635Z" fill="#FFFFFF" className="dark:fill-white fill-primary-foreground"/>
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
