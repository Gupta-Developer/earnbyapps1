
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube, Gift } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task } from "@/lib/types";
import { MOCK_TASKS } from "@/lib/mock-data";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import ActivityTicker from "@/components/activity-ticker";

const WhatsAppIcon = () => (
    <svg 
        viewBox="0 0 24 24" 
        className="h-8 w-8 text-[#25D366]"
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.77.46 3.45 1.26 4.94l-1.38 5.25 5.37-1.38c1.44.77 3.06 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.24-.12-1.44-.71-1.67-.79s-.38-.12-.53.12-.62.79-.76.95c-.14.18-.29.18-.53.06s-1.04-.38-1.98-1.22c-.74-.65-1.23-1.47-1.38-1.71s-.03-.35.09-.47c.11-.11.24-.29.35-.44s.18-.24.27-.41c.09-.18.04-.32-.02-.44s-.53-1.29-.73-1.76c-.2-.47-.41-.41-.56-.41h-.47c-.15 0-.38.06-.59.29s-.79.76-.79 1.85c0 1.09.81 2.15.92 2.31s1.47 2.23 3.58 3.18c.5.24.9.38 1.2.47s.59.15.81.09c.27-.06.88-.36 1- .71s.12-.65.09-.71c-.03-.06-.18-.09-.41-.21z"/>
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

type FilterType = "all" | "high-paying" | "instant";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const filter = searchParams.get('tab') as FilterType || 'all';

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    setTasks(MOCK_TASKS);
  }, []);
  
  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };


  const filteredTasks = tasks.filter((task) => {
    if (filter === "high-paying") {
      return task.isHighPaying;
    }
    if (filter === "instant") {
        return task.isInstant;
    }
    return true;
  });

  const carouselItems = [
    { id: 1, image: 'https://placehold.co/1200x400.png', alt: 'Promotion 1', hint: 'special offer' },
    { id: 2, image: 'https://placehold.co/1200x400.png', alt: 'Promotion 2', hint: 'new tasks' },
    { id: 3, image: 'https://placehold.co/1200x400.png', alt: 'Promotion 3', hint: 'big rewards' },
  ];

  return (
    <div className="space-y-4">
      <ActivityTicker />
      <div className="mt-12 space-y-4">
       <Card className="shadow-md rounded-lg overflow-hidden -mx-4 md:mx-0">
         <Carousel 
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
         >
            <CarouselContent>
                {carouselItems.map((item) => (
                    <CarouselItem key={item.id}>
                        <div className="relative h-40 md:h-56">
                             <Image 
                                src={item.image} 
                                alt={item.alt}
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint={item.hint}
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
         </Carousel>
       </Card>

       <div className="sticky top-28 bg-card z-10 py-2 md:top-0">
         <div className="flex justify-center">
            <Tabs value={filter} onValueChange={handleTabChange} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Apps</TabsTrigger>
                <TabsTrigger value="high-paying">High Paying</TabsTrigger>
                <TabsTrigger value="instant">Instant Paying</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Link href={`/tasks/${task.id}`} key={task.id} className="block">
            <Card className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] h-full">
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
         <Link href="/share" className="block">
            <Card className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] h-full">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-[50px] h-[50px] rounded-lg bg-primary/10 flex items-center justify-center">
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
      
      <Card className="shadow-md rounded-lg">
          <CardHeader>
              <CardTitle>Join Our Community</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
    </div>
  );
}
