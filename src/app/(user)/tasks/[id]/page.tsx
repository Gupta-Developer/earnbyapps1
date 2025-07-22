
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import { tasks, transactions } from '@/lib/data';
import { Transaction } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

  const referralCode = `EBA${task.id}WIN`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const handleStartTask = () => {
    // In a real app, you'd get the current user from auth state.
    const currentUserId = 1; 
    const existingTask = transactions.find(t => t.taskId === task.id && t.userId === currentUserId);
    if(existingTask) {
       toast({
        title: "Task Already Started",
        description: `You have already started the "${task.name}" task.`,
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      userId: currentUserId,
      taskId: task.id,
      app: task.name,
      amount: task.reward,
      status: 'Under Verification',
      date: new Date(),
    };
    transactions.push(newTransaction);
    
    toast({
      title: "Task Started!",
      description: `"${task.name}" is now under verification in your wallet.`,
    });
    
    router.push('/wallet');
  };

  const faqs = [
      {
          question: "What if I don't complete all the steps?",
          answer: "You must complete all the steps exactly as listed to be eligible for the reward. Partial or incomplete submissions will not be rewarded."
      },
      {
          question: "How long does verification take?",
          answer: "Verification typically takes between 24 to 48 hours. Once our team confirms your completion, the status will update in your wallet and the reward will be credited."
      },
      {
          question: "Do I need to use the referral code?",
          answer: "Yes, using the special referral code is mandatory if provided. It's how we track your task completion and link it to your account for payment."
      },
      {
          question: "Can I do the same task twice?",
          answer: "No, each task is designed to be completed only once per user. This ensures fair opportunities for everyone in the community to earn."
      },
      {
          question: "What if I face an issue with the app?",
          answer: "If you encounter any technical problems with the partner app (e.g., download issues, crashes), please contact their support. For issues related to our platform or your payment, please contact our support team."
      }
  ]

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow p-4 space-y-4">
        <Card className="shadow-md rounded-lg w-full">
          <CardContent className="p-6 space-y-6">
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
                  {task.steps.map((step, index) => (
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

            <Button onClick={handleStartTask} size="lg" className="w-full shadow-lg">Start Task &amp; Earn ₹{task.reward}</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg w-full overflow-hidden">
            <CardContent className="p-0">
                <div className="aspect-video">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        title="YouTube video player" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="border-0"
                        >
                    </iframe>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                         <AccordionItem value={`item-${index}`} key={index} className="border-b-0 border-t">
                            <AccordionTrigger className="text-left hover:no-underline rounded-lg px-4 data-[state=open]:bg-secondary/50">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pt-2 px-4 pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </main>

    </div>
  );
}
