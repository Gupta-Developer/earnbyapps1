"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube } from "lucide-react";
import { tasks } from "@/lib/data";

const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-green-500"
      fill="currentColor"
    >
      <title>WhatsApp</title>
      <path d="M12.04 2.176c-5.49 0-9.927 4.525-9.927 10.093 0 2.214.71 4.285 1.94 5.965L2.007 22l4.09-2.01c1.58.94 3.42 1.44 5.37 1.44 5.49 0 9.926-4.524 9.926-10.094s-4.437-10.093-9.926-10.093zm-1.37 12.392c-.15.424-.75.82-1.27.97-.46.14-1.12.15-1.63-.04-1.1-.4-2.12-1.27-2.88-2.6-1.02-1.78-1.55-3.3-1.55-4.54 0-2.4 1.76-3.66 2.3-4.13.3-.26.6-.3.8-.3s.42.02.6.02c.23.01.5.38.68.7.18.32.62 1.5.68 1.62.06.12.04.26-.05.4-.1.13-.18.23-.33.38-.15.15-.3.26-.42.35-.12.1-.2.18-.04.4.15.22.68.95 1.3 1.5s1.2 1 1.7 1.2c.2.08.3.06.4-.04.1-.1.4-.48.5-.62.1-.15.2-.12.3-.12h.5c.2 0 .5.2.6.4.1.2.4.9.5 1.1s.1.4.04.5z" />
    </svg>
);


const socialLinks = [
    {
        name: "WhatsApp Channel",
        href: "#",
        icon: <WhatsAppIcon />,
        className: "bg-green-100 dark:bg-green-900/50"
    },
    {
        name: "Instagram",
        href: "#",
        icon: <Instagram className="h-8 w-8 text-pink-600" />,
        className: "bg-pink-100 dark:bg-pink-900/50"
    },
    {
        name: "YouTube",
        href: "#",
        icon: <Youtube className="h-8 w-8 text-red-600" />,
        className: "bg-red-100 dark:bg-red-900/50"
    },
]

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <header className="py-2">
        <p className="text-center text-muted-foreground">Complete tasks and earn rewards!</p>
      </header>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link href={`/tasks/${task.id}`} key={task.id} className="block">
            <Card className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Image 
                    src={task.icon} 
                    alt={`${task.name} icon`} 
                    width={50} 
                    height={50} 
                    className="rounded-lg"
                    data-ai-hint={task.hint} 
                  />
                  <div>
                    <h2 className="font-bold text-lg">{task.name}</h2>
                    <p className="text-accent font-semibold">Earn ₹{task.reward}</p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <Card className="shadow-md rounded-lg">
          <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
              {socialLinks.map((social) => (
                  <a href={social.href} key={social.name} target="_blank" rel="noopener noreferrer" className="block">
                      <div className={`p-4 flex items-center gap-4 rounded-lg ${social.className} transition-transform hover:scale-[1.02] active:scale-[0.98]`}>
                          {social.icon}
                          <span className="font-semibold text-foreground">{social.name}</span>
                          <ChevronRight className="h-6 w-6 text-muted-foreground ml-auto" />
                      </div>
                  </a>
              ))}
          </CardContent>
      </Card>

    </div>
  );
}
