
"use client";

import Link from "next/link";
import React from "react";

const footerLinks = [
  { href: "/about", label: "About Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-card border-t py-4 px-6 md:mb-0">
      <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.label}>
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
