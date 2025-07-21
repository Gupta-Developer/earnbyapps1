
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube } from "lucide-react";
import { tasks } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-[#25D366]"
      fill="currentColor"
    >
        <path d="M16.75 13.96c.25.41.41.83.41 1.25 0 .41-.08.83-.25 1.25-.17.41-.42.75-.75 1.08s-.75.58-1.17.75c-.41.17-.83.25-1.25.25-.41 0-1.08-.08-1.5-.25s-1.08-.41-1.58-.75c-.5-.33-1.08-.75-1.58-1.17s-.92-1-1.25-1.58c-.33-.58-.58-1.17-.75-1.75s-.25-1.17-.25-1.75.08-1.17.25-1.75.41-1.08.75-1.58c.33-.5.75-1 1.25-1.41.5-.42 1-.75 1.58-.92.58-.17 1.17-.25 1.75-.25.58 0 1.17.08 1.75.25s1.08.41 1.58.75c.5.34.92.75 1.25 1.25s.58 1 .75 1.58c.17.58.25 1.17.25 1.75s-.08 1.17-.25 1.75-.42 1.08-.75 1.58z M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M19.07 4.93a10 10 0 0 0-14.14 0 10 10 0 0 0 0 14.14 10 10 0 0 0 14.14 0 10 10 0 0 0 0-14.14zM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="m17.5 6.5-11 11" />
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
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const filteredTasks = tasks.filter((task) => {
    if (filter === "high-paying") {
      return task.reward >= 50;
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
