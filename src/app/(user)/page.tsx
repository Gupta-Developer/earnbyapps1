"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const tasks = [
  { id: 1, name: "GrowMeOrganic", reward: 20, icon: "https://placehold.co/60x60.png", hint: "growth chart" },
  { id: 2, name: "AppCreator", reward: 50, icon: "https://placehold.co/60x60.png", hint: "mobile app" },
  { id: 3, name: "TaskRunner", reward: 15, icon: "https://placehold.co/60x60.png", hint: "running shoe" },
  { id: 4, name: "DataMiner", reward: 100, icon: "https://placehold.co/60x60.png", hint: "data analysis" },
  { id: 5, name: "SocialBoost", reward: 25, icon: "https://placehold.co/60x60.png", hint: "social media" },
];

export default function HomePage() {
  const { toast } = useToast();

  const handleStartTask = (taskName: string) => {
    toast({
      title: "Task Started!",
      description: `You have started the "${taskName}" task.`,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <header className="py-2">
        <h1 className="text-2xl font-bold text-center text-foreground">EarnByApps</h1>
      </header>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="shadow-md rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
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
              <Button onClick={() => handleStartTask(task.name)} className="shadow-md">Start Task</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
