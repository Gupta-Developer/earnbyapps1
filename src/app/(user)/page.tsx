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
        <path d="M16.75 13.96c.25.42.42.84.59 1.25.17.42.26.84.26 1.25 0 .74-.25 1.39-.74 1.94s-1.11.82-1.85.82h-.17c-.33 0-.68-.06-1.04-.17-.37-.11-.74-.29-1.12-.53s-.79-.53-1.21-.88c-.42-.35-.82-.74-1.19-1.16-.37-.42-.72-.88-1.04-1.39s-.57-1.04-.79-1.58c-.22-.53-.33-1.08-.33-1.63s.11-1.08.33-1.58c.22-.5.5-.97.85-1.39s.74-.82 1.16-1.16.88-.65 1.36-.88c.48-.24.97-.35 1.48-.35h.17c.33 0 .65.05.94.14s.55.23.79.42c.24.19.44.42.59.68s.25.53.3.82c.05.28.06.55.03.82s-.1.53-.2.79c-.1.26-.23.5-.38.71s-.32.42-.5.59c-.17.17-.35.3-.53.38-.17.08-.32.14-.44.17-.12.03-.23.05-.33.05-.11 0-.23-.02-.33-.06s-.2-.11-.29-.2c-.1-.08-.19-.17-.26-.26-.08-.09-.14-.19-.19-.28l-.06-.11c-.02-.04-.03-.08-.03-.11 0-.08.03-.17.08-.25s.14-.14.25-.21l.23-.14c.24-.14.44-.29.59-.44s.28-.32.38-.5c.09-.17.14-.35.14-.53 0-.11-.02-.23-.06-.33s-.1-.2-.17-.28c-.08-.09-.17-.15-.28-.19-.11-.04-.23-.06-.35-.06h-.82c-.28 0-.55.08-.79.25s-.47.38-.68.62c-.2.24-.38.5-.53.79s-.25.59-.3.88c-.05.28-.06.56-.03.85s.1.56.2.82l.19.53c.2.53.47 1.02.82 1.48s.74.88 1.19 1.28c.44.4.91.74 1.41 1.04.5.29 1.02.5 1.56.62.54.12 1.06.19 1.56.19h.17c.74 0 1.39-.24 1.94-.71s.82-1.08.82-1.82c0-.42-.08-.84-.25-1.25s-.38-.79-.62-1.14c-.25-.35-.53-.65-.85-.88s-.65-.42-1-.53c-.35-.11-.68-.17-1-.17s-.61.05-.88.14c-.28.09-.52.23-.74.41s-.41.38-.56.62c-.14.24-.21.48-.21.74zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
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
