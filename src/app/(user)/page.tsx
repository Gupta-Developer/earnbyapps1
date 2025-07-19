
"use client";

import { useRef } from "react";
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
      className="h-8 w-8 text-green-600 dark:text-green-500"
      fill="currentColor"
    >
      <title>WhatsApp</title>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2.05 22l5.25-1.38c1.41.79 3.02 1.22 4.74 1.22 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM17.62 15.2c-.23.41-.85.76-1.47.91-.62.15-1.23.2-1.8.1-1.12-.2-2.12-.74-2.98-1.5-.96-.85-1.63-1.9-1.93-3.08-.21-.85-.1-1.6.32-2.31.3-.5.7-.75 1.13-.9.42-.15.86-.1 1.28.08.35.15.6.45.75.8.15.35.15.75.1 1.1-.05.35-.15.7-.3.95-.15.25-.3.45-.5.6s-.4.3-.6.35c-.2.05-.4.1-.6.05-.2-.05-.4-.1-.6-.2s-.35-.2-.5-.35c-.15-.15-.3-.3-.4-.5s-.2-.4-.25-.6c-.05-.2-.05-.4.05-.6.1-.2.25-.35.45-.5s.4-.25.65-.3c.25-.05.5-.05.7,0s.4.1.55.25.25.3.35.5.15.35.2.55.05.4,0 .6-.05.4-.15.55c-.1.15-.2.3-.35.4s-.3.2-.45.25c-.15.05-.3.05-.45,0-.15,0-.3-.05-.4-.1s-.2-.15-.3-.2c-.1-.05-.2-.1-.25-.2-.05-.05-.1-.1-.15-.15-.05-.05-.1-.1-.1-.15s-.05-.1-.05-.15c0-.05,0-.1.05-.15s.05-.1.1-.15.1-.05.15-.05.1,0,.15,0c.05,0,.1,0,.15,0s.1,0,.15,0 .1,0,.15,0 .1,0,.15-.05.1-.05.15-.05.1,0,.15,0 .1,0,.15,0 .1,0,.15,0 .1,0,.15,0c.05,0,.1,0,.15,0s.1,0,.1,0 .05,0,.1,0 .05,0,.05,0 .05,0,.05,0 .05,0,.05,0 .05,0,0,0c.05,0,0,0,0,0,.35,0,.65-.15.9-.45.25-.3.45-.7.5-1.15.05-.45,0-.9-.1-1.35s-.3-.85-.5-1.2c-.2-.35-.5-.65-.85-.85s-.75-.3-1.15-.3-1.2.1-1.7.4c-.5.3-1,.7-1.3,1.2-.3.5-.5,1.05-.6,1.65-.1.6-.05,1.2.15,1.75.2.55.5,1.05.9,1.5.4.45.85.8,1.35,1.1.5.3,1.05.5,1.6.6.55.1,1.1.1,1.65,0 .6-.1,1.1-.35,1.5-.75.3-.3.5-.7.6-1.15.05-.3.05-.6,0-.85-.05-.25-.15-.5-.3-.7-.15-.2-.35-.35-.55-.45-.2-.1-.45-.1-.65,0-.2.05-.4.15-.55.3-.15.15-.25.3-.3.5s-.1.4-.05.6.1.4.2.55c.1.15.25.3.4.35s.3.1.5,0c.15-.05.3-.15.4-.25.1-.1.2-.2.25-.35s.1-.3.1-.45,0-.3-.05-.45c-.05-.15-.1-.3-.2-.4s-.15-.2-.25-.25-.2-.1-.3-.1-.2,0-.3.05c-.1.05-.2.1-.25.2s-.1.15-.15.25c-.05.1-.05.15-.05.25s0,.2.05.3.1.15.15.25.15.15.2.2c.05.05.1.1.15.1s.1.05.15.05c.05,0,.1,0,.1,0s.05,0,.1,0 .05,0,.1,0 .05,0,.05,0 .05,0,0,0 .05,0,0,0h0c.05,0,0,0,0,0z"/>
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
