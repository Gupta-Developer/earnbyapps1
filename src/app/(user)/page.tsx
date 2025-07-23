
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Task } from "@/lib/types";
import { MOCK_TASKS } from "@/lib/mock-data";

const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-[#25D366]"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2 22l5.05-1.32c1.47.86 3.16 1.32 4.95 1.32h.01c5.46 0 9.91-4.45 9.91-9.91c0-5.46-4.45-9.91-9.91-9.91zM12.04 20.57c-1.63 0-3.17-.5-4.45-1.36l-.32-.19-3.3 1.05 1.07-3.23-.22-.34a8.42 8.42 0 0 1-1.28-4.59c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5c0 4.69-3.81 8.5-8.5 8.5zM16.51 14.49c-.22-.11-1.3-.64-1.5-.72s-.35-.11-.5.11c-.15.22-.57.72-.7.86s-.25.17-.45.06c-.2-.12-.85-.31-1.61-1s-1.29-1.24-1.41-1.45c-.12-.22-.02-.34.09-.45s.22-.25.33-.37c.11-.12.15-.22.22-.37s.04-.27-.02-.37c-.06-.11-.5-1.21-.69-1.64s-.37-.36-.5-.36h-.41c-.2 0-.45.06-.68.31s-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.76 2.67 4.25 3.74s1.65.75 2.2.71c.71-.04 1.3-.53 1.48-.91s.18-.7.13-.81c-.05-.11-.19-.17-.4-.28z"/>
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

const carouselItems = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/600x400.png',
    hint: 'money gift',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/600x400.png',
    hint: 'people sharing',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/600x400.png',
    hint: 'money stack',
  },
];


type FilterType = "all" | "high-paying" | "instant";

export default function HomePage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  useEffect(() => {
    // In a real app, you'd fetch this from an API.
    // For now, we use mock data.
    setTasks(MOCK_TASKS);
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "high-paying") {
      return task.isHighPaying;
    }
    if (filter === "instant") {
        return task.isInstant;
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4">
      <header className="py-2">
        <p className="text-center text-muted-foreground">Complete tasks and earn rewards!</p>
      </header>

      <Carousel 
        className="w-full" 
        opts={{ loop: true }}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <Card className="rounded-lg overflow-hidden shadow-md">
                <CardContent className="p-0">
                  <Image
                    src={item.imageUrl}
                    alt="Promotional offer"
                    width={600}
                    height={300}
                    className="w-full h-auto aspect-[2/1] object-cover"
                    data-ai-hint={item.hint}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="flex justify-center">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All Apps</TabsTrigger>
            <TabsTrigger value="high-paying">High Paying</TabsTrigger>
            <TabsTrigger value="instant">Instant Paying</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
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
