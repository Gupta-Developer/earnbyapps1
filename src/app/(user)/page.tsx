
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
        <path d="M16.75 13.96c.25.13.41.33.41.55v.02c0 .22-.04.43-.12.63s-.2.38-.34.54c-.14.16-.3.29-.48.4s-.38.19-.59.24c-.21.05-.43.06-.65.04s-.43-.08-.63-.18c-.2-.09-.38-.22-.56-.37s-.34-.3-.5-.47c-.16-.17-.32-.34-.47-.51s-.28-.34-.42-.51c-.13-.17-.26-.34-.38-.51s-.22-.33-.32-.48c-.1-.15-.19-.29-.26-.43s-.14-.27-.18-.4c-.05-.13-.08-.26-.09-.39s0-.26.02-.39c.02-.13.05-.25.1-.37s.1-.23.17-.33c.07-.1.14-.19.23-.27.09-.08.18-.15.28-.2s.2-.09.3-.12.2-.05.3-.06c.1-.01.2-.01.3 0 .1.01.19.02.28.05.09.02.18.05.26.09.08.04.16.08.23.13.07.05.14.1.2.16.06.06.12.12.17.18.05.06.09.13.12.2.03.07.06.14.07.22s.02.16,0 .24c-.02.08-.05.16-.09.23-.04.07-.08.14-.13.2s-.1.12-.16.17c-.06.05-.12.1-.17.14s-.1.08-.13.1c-.04.03-.06.06-.08.08-.02.02-.02.05-.02.07s.01.04.02.06c.01.02.03.03.05.05.02.01.04.03.06.04s.04.03.07.04.05.02.08.03.06.02.09.02c.03,0,.07,0,.1-.01s.06-.01.09-.02c.03-.01.07-.02.1-.04.03-.01.07-.03.1-.05s.06-.04.1-.06.07-.05.1-.08.06-.06.1-.09c.03-.03.07-.06.1-.1.03-.04.06-.07.08-.11.03-.04.05-.08.06-.13.01-.05.02-.1.02-.15s0-.1-.01-.14c0-.05-.01-.09-.02-.13s-.03-.08-.05-.12c-.02-.04-.04-.08-.06-.11s-.05-.07-.08-.1c-.03-.03-.06-.06-.08-.08s-.05-.04-.08-.06-.06-.03-.09-.04-.06-.02-.1-.02c-.07-.02-.15-.02-.22,0zM10.87 12.3c.02.03.04.06.06.09.02.03.05.06.07.09.02.03.05.06.08.09.03.03.06.06.09.09.03.03.07.05.1.08.04.03.08.06.12.08.04.03.09.05.13.07.05.02.09.04.14.05.05.01.1.02.15.03.05,0,.1,0,.15,0,.05,0,.1,0,.15,0,.05,0,.1,0,.15-.01.05,0,.1,0,.15-.01.05,0,.1,0,.14-.02.05-.01.09-.02.14-.04s.09-.04.13-.06.09-.05.13-.08c.04-.03.08-.06.12-.09.04-.03.08-.07.11-.11.03-.04.07-.08.09-.12.03-.04.05-.09.07-.14.02-.05.03-.1.04-.15.01-.05.01-.1.01-.15s0-.1-.01-.15-.02-.1-.04-.15c-.01-.05-.03-.1-.06-.14-.02-.05-.05-.09-.08-.13-.03-.04-.07-.08-.11-.11-.04-.03-.08-.06-.12-.09-.05-.03-.09-.05-.14-.07-.05-.02-.1-.04-.15-.05-.05-.01-.1-.02-.15-.02-.05,0-.1,0-.15,0s-.1,0-.15,0c-.05,0-.1,0-.15.01s-.1.02-.14.03c-.05.01-.09.03-.14.05-.05.02-.09.04-.13.06-.04.03-.08.05-.12.08-.04.03-.08.06-.11.09-.03.03-.07.06-.09.1-.03.03-.05.07-.07.11-.02.04-.04.08-.05.12-.01.05-.02.09-.02.14z"/>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
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
