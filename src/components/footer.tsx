"use client";

import Link from "next/link";

const footerLinks = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="w-full max-w-[480px] bg-card border-t py-4 px-6 mb-16">
      <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.href}>
            <Link href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
            {index < footerLinks.length - 1 && <span>•</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground/50 mt-4">
        © {new Date().getFullYear()} EarnByApps. All rights reserved.
      </div>
    </footer>
  );
}

import * as React from "react";
