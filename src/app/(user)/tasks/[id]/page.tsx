"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const tasks = [
  { 
    id: 1, 
    name: "GrowMeOrganic", 
    reward: 20, 
    icon: "https://placehold.co/80x80.png", 
    hint: "growth chart",
    description: "Help test a new app for organic gardening enthusiasts.",
    steps: [
        "Download the GrowMeOrganic app from the link provided.",
        "Create an account using your email.",
        "Use the plant identification feature on 3 different plants.",
        "Submit feedback through the in-app form.",
    ]
  },
  { 
    id: 2, 
    name: "AppCreator", 
    reward: 50, 
    icon: "https://placehold.co/80x80.png", 
    hint: "mobile app",
    description: "Test the beta version of our no-code app builder.",
    steps: [
        "Sign up for a beta account on the AppCreator website.",
        "Build a simple one-page app using the drag-and-drop editor.",
        "Publish your test app.",
        "Complete the user experience survey.",
    ]
  },
  { 
    id: 3, 
    name: "TaskRunner", 
    reward: 15, 
    icon: "https://placehold.co/80x80.png", 
    hint: "running shoe",
    description: "Get paid to complete simple local errands and tasks.",
     steps: [
        "Install the TaskRunner application.",
        "Complete your profile and identity verification.",
        "Accept and complete one 'demo' task in the app.",
        "Confirm task completion to receive your reward.",
    ]
  },
  { 
    id: 4, 
    name: "DataMiner", 
    reward: 100, 
    icon: "https://placehold.co/80x80.png", 
    hint: "data analysis",
    description: "Help us improve our data analysis algorithms.",
    steps: [
        "Download and install the DataMiner software.",
        "Run the software on a dataset of your choice (min 1000 rows).",
        "Export the analysis report.",
        "Upload the report to the specified cloud drive.",
    ]
  },
  { 
    id: 5, 
    name: "SocialBoost", 
    reward: 25, 
    icon: "https://placehold.co/80x80.png", 
    hint: "social media",
    description: "Boost your social media presence with our new tool.",
    steps: [
        "Connect your primary social media account.",
        "Schedule 5 posts using the SocialBoost scheduler.",
        "Let the posts be published automatically.",
        "Take a screenshot of your scheduled posts queue.",
    ]
  },
];

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const taskId = params.id;

  const task = tasks.find(t => t.id.toString() === taskId);

  if (!task) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-xl font-semibold">Task not found</h2>
            <p className="text-muted-foreground mt-2">This task may no longer be available.</p>
            <Button onClick={() => router.push('/')} className="mt-6">Go Home</Button>
        </div>
    );
  }

  const handleStartTask = () => {
    toast({
      title: "Task Started!",
      description: `You have started the "${task.name}" task. Good luck!`,
    });
    // Here you would typically redirect the user to an external link
    // or start a process in your backend.
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">{task.name}</h1>
      </header>
      
      <main className="flex-grow p-4 space-y-6">
        <Card className="shadow-md rounded-lg text-center">
          <CardContent className="p-6 flex flex-col items-center gap-4">
             <Image 
                src={task.icon} 
                alt={`${task.name} icon`} 
                width={70} 
                height={70} 
                className="rounded-xl"
                data-ai-hint={task.hint} 
              />
              <div>
                <h2 className="font-bold text-2xl">{task.name}</h2>
                <p className="text-accent font-semibold text-xl mt-1">Earn ₹{task.reward}</p>
                <p className="text-muted-foreground mt-2 text-sm">{task.description}</p>
              </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Steps to Follow</CardTitle>
            <CardDescription>Complete these steps to earn your reward.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {task.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                        <span className="text-foreground">{step}</span>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>

      </main>

      <footer className="p-4 sticky bottom-0 bg-card/80 backdrop-blur-sm z-10 border-t">
        <Button onClick={handleStartTask} size="lg" className="w-full shadow-lg">Start Task & Earn ₹{task.reward}</Button>
      </footer>
    </div>
  );
}
