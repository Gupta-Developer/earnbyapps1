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
      <path
        d="M16 2.66663C8.63636 2.66663 2.66667 8.63629 2.66667 16C2.66667 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3333 23.3636 29.3333 16C29.3333 8.63629 23.3637 2.66663 16 2.66663Z"
        fill="currentColor"
      />
      <path
        d="M19.1667 12.8333C19.1667 12.3916 18.9911 11.9673 18.6885 11.6647C18.386 11.3622 17.9616 11.1865 17.525 11.1865H12.8333V14.4749H16.7083C17.145 14.4749 17.5693 14.6506 17.8719 14.9532C18.1744 15.2557 18.3501 15.6801 18.3501 16.1166C18.3501 16.5532 18.1744 16.9776 17.8719 17.2801C17.5693 17.5827 17.145 17.7583 16.7083 17.7583H12.8333V21.0468H17.525C17.9616 21.0468 18.386 20.8711 18.6885 20.5685C18.9911 20.266 19.1667 19.8416 19.1667 19.4049V12.8333Z"
        fill="#FFFFFF"
        className="dark:fill-background"
      />
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
