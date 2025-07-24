
"use client";

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { Task, Transaction } from '@/lib/types';
import { MOCK_TASKS, MOCK_TRANSACTIONS } from '@/lib/mock-data';


export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user } = useAuth();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!taskId) return;
    // In a real app, you'd fetch this from an API.
    // For now, we find it in our mock data.
    const foundTask = MOCK_TASKS.find(t => t.id === taskId);
    if (foundTask) {
        setTask(foundTask);
    } else {
        // Handle task not found
        console.error("No such task!");
    }
  }, [taskId]);

  if (!task) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-xl font-semibold">Loading Task...</h2>
            <p className="text-muted-foreground mt-2">Just a moment.</p>
        </div>
    );
  }

  const referralCode = `EBA${task.id.substring(0,5).toUpperCase()}WIN`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const handleStartTask = async () => {
    if (!user) return;
    // This is where you would normally interact with a database.
    console.log(`Starting task ${task.id} for user ${user.id}`);
    
    // Create a new transaction and add it to our mock data
    const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        userId: user.id,
        taskId: task.id,
        title: task.name,
        amount: task.reward,
        status: 'Under Verification',
        date: new Date(),
    };
    MOCK_TRANSACTIONS.unshift(newTransaction); // Add to the beginning of the array

    toast({
        title: "Task Started!",
        description: `"${task.name}" is now under verification in your wallet.`,
    });
    
    // We don't redirect to the wallet anymore, since the user is sent to an external link.
  };

  const stepsArray = typeof task.steps === 'string' ? task.steps.split('\n').filter(s => s.trim() !== '') : [];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow p-4 space-y-4">
        <Card className="shadow-md rounded-lg w-full overflow-hidden">
          {task.banner && (
            <div className="relative w-full h-40">
              <Image 
                src={task.banner} 
                alt={`${task.name} banner`} 
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                data-ai-hint="promotional banner"
              />
            </div>
          )}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
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
                  </div>
              </div>
              <p className="text-muted-foreground text-sm">{task.description}</p>
            </div>


            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Steps to Follow:</h3>
              <ul className="space-y-4">
                  {stepsArray.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                          <span className="text-foreground text-sm">{step}</span>
                      </li>
                  ))}
              </ul>
            </div>
            
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2">Your Special Referral Code</h3>
                <p className="text-sm text-muted-foreground mb-3">
                    Using this code helps us track your task completion and ensures you get your reward faster. Make sure to use it when prompted in the app!
                </p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-dashed">
                    <span className="font-mono text-lg text-accent flex-grow tracking-widest">{referralCode}</span>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                        <Copy className="h-4 w-4 mr-2"/>
                        Copy
                    </Button>
                </div>
            </div>
            
            <Separator />

            {user ? (
                <Button asChild size="lg" className="w-full shadow-lg" onClick={handleStartTask}>
                    <a href={task.link} target="_blank" rel="noopener noreferrer">
                        Start Task &amp; Earn ₹{task.reward}
                    </a>
                </Button>
            ) : (
                <Button size="lg" className="w-full shadow-lg" onClick={() => router.push(`/profile?redirect_to=${pathname}`)}>
                    Login to Start Task
                </Button>
            )}
          </div>
        </Card>

        {task.youtubeLink && (
            <Card className="shadow-md rounded-lg w-full overflow-hidden">
                <CardContent className="p-0">
                    <div className="aspect-video">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src={task.youtubeLink} 
                            title="YouTube video player" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="border-0"
                            >
                        </iframe>
                    </div>
                </CardContent>
            </Card>
        )}

        {task.faqs && task.faqs.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold px-1">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {task.faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/50 rounded-lg px-4 border-b-0">
                            <AccordionTrigger className="text-left hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pt-0 pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )}
      </main>

    </div>
  );
}
