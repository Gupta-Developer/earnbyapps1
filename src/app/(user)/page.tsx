
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube, Gift } from "lucide-react";
import { Task } from "@/lib/types";
import { MOCK_TASKS } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import WhatsAppIcon from "@/components/whatsapp-icon";



const socialLinks = [
    {
        name: "WhatsApp Channel",
        href: "#",
        icon: <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />,
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const plugin = useRef(
      Autoplay({ delay: 2000, stopOnInteraction: true })
    );

  useEffect(() => {
    setTasks(MOCK_TASKS);
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "high-paying") {
      return tasks.filter((task) => task.isHighPaying);
    }
    if (filter === "instant") {
      return tasks.filter((task) => task.isInstant);
    }
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="pb-4 pt-4 space-y-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {MOCK_TASKS.map((task, index) => (
            <CarouselItem key={index}>
              <Link href={`/tasks/${task.id}`}>
                <Card className="overflow-hidden">
                   <div className="relative w-full h-40">
                      {task.banner ? (
                        <Image 
                            src={task.banner} 
                            alt={`${task.name} banner`} 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                            data-ai-hint="promotional banner"
                        />
                      ) : (
                         <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <p className="text-muted-foreground">No banner available</p>
                         </div>
                      )}
                   </div>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      <Tabs defaultValue={filter} onValueChange={setFilter} className="w-full">
        <div className="flex justify-center">
            <TabsList className="bg-muted">
                <TabsTrigger value="all">All Apps</TabsTrigger>
                <TabsTrigger value="high-paying">High Paying</TabsTrigger>
                <TabsTrigger value="instant">Instant Paying</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value={filter}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {filteredTasks.map((task) => (
                <Link href={`/tasks/${task.id}`} key={task.id} className="block h-full">
                <Card className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] h-full">
                    <CardContent className="p-4 flex items-center justify-between h-full">
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
            <Link href="/share" className="block h-full">
                <Card className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] h-full">
                <CardContent className="p-4 flex items-center justify-between h-full">
                    <div className="flex items-center gap-4">
                        <div className="w-[50px] h-[50px] rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Gift className="w-7 h-7 text-primary" />
                        </div>
                    <div>
                        <h2 className="font-bold text-lg">EarnByApps</h2>
                        <p className="text-accent font-semibold">Earn ₹5</p>
                    </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </CardContent>
                </Card>
            </Link>
            </div>
        </TabsContent>
       </Tabs>
      
      <Card className="shadow-md rounded-lg">
          <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
