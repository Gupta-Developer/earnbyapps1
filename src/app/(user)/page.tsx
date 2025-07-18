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
    className="h-8 w-8 text-green-600 dark:text-green-500"
    fill="currentColor"
  >
    <title>WhatsApp</title>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2.05 22l5.25-1.38c1.41.79 3.02 1.22 4.74 1.22 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.53 8.5c.22-.66 1.33-1.22 2.23-1.22.64 0 1.22.18 1.63.88.42.7.45 1.73.13 2.58-.32.85-1.19 1.41-1.92 1.41-.33 0-.64-.09-.88-.22-.24-.13-.48-.3-.68-.5-.2-.19-.38-.41-.53-.64-.15-.23-.29-.48-.39-.73s-.18-.5-.22-.76c-.04-.26 0-.52.09-.76s.22-.48.39-.7.38-.41.59-.59c.22-.19.48-.34.76-.48.29-.14.59-.22.91-.22.32 0 .63.08.91.22s.53.34.75.59c.22.25.39.54.53.85.13.32.2.66.2.99s-.07.66-.2.98c-.13.32-.31.62-.53.88-.22.26-.48.5-.78.68-.3.19-.64.31-1.02.38-.38.07-.77.07-1.15 0-.38-.07-.73-.2-1.05-.38-.32-.19-.6-.41-.83-.68-.23-.27-.42-.56-.56-.88-.14-.32-.23-.66-.25-.99s0-.66.09-.98c.09-.32.23-.62.41-.88.19-.26.41-.5.66-.68.25-.19.53-.31.83-.38.3-.07.62-.07.94 0 .32.07.62.2.88.38.26.19.48.41.66.68.19.27.32.56.41.88.09.32.13.66.09.98s-.13.64-.26.94c-.13.3-.31.58-.53.82-.22.24-.48.45-.76.62-.29.17-.6.29-.93.34-.33.05-.66.04-.99-.02-.33-.06-.64-.18-.93-.34-.29-.16-.55-.37-.78-.62s-.42-.54-.56-.85c-.14-.32-.22-.66-.22-1.01 0-.35.07-.68.22-1.01.14-.32.34-.62.59-.85.25-.23.54-.42.85-.56.32-.14.66-.22 1.01-.22s.7.08 1.01.22c.32.14.6.34.85.56.25.23.45.5.59.85.14.32.22.66.22 1.01z"/>
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
