
"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MOCK_TASKS } from "@/lib/mock-data";

export default function OfferwallPage() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="py-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {MOCK_TASKS.map((task) => (
            <CarouselItem key={task.id}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-video items-center justify-center p-0">
                     {task.banner && (
                        <div className="relative w-full h-full">
                            <Image 
                                src={task.banner} 
                                alt={`${task.name} banner`} 
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint="promotional banner"
                            />
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
