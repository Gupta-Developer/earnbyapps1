
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, Instagram, Youtube, Copy, UserPlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Task } from "@/lib/types";
import { MOCK_TASKS, MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

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

const carouselItems = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/600x300.png',
    hint: 'money gift',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/600x300.png',
    hint: 'people sharing',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/600x300.png',
    hint: 'money stack',
  },
];


type FilterType = "all" | "high-paying" | "instant";

export default function HomePage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    setTasks(MOCK_TASKS);
    if (user) {
        // In a real app, you would fetch more detailed user data
        const currentUserData = MOCK_USERS[user.id];
        setUserPhoneNumber(currentUserData?.phone || null);
    }
  }, [user]);

  const handleCopyCode = () => {
    if (userPhoneNumber) {
        navigator.clipboard.writeText(userPhoneNumber);
        toast({
          title: "Copied!",
          description: "Your referral code has been copied.",
        });
    }
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
      
       <Card className="shadow-md rounded-lg bg-secondary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus />
            Refer & Earn
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user && userPhoneNumber ? (
            <>
              <p className="text-muted-foreground text-sm mb-3">
                Share your referral code with friends. When they sign up, you both get a bonus!
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-background border border-dashed">
                <span className="font-mono text-lg text-accent flex-grow tracking-widest">{userPhoneNumber}</span>
                <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <p className="mb-4">Log in to get your referral code and start earning!</p>
              <Button asChild>
                <Link href="/profile">
                  Login or Sign Up
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
