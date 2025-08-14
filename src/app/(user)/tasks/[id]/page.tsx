
"use client";

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Copy, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { Task, Transaction } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';


export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, appUser } = useAuth();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
  const [isStarting, setIsStarting] = useState(false);


  const checkExistingTransaction = useCallback(async () => {
    if (!user || !taskId) return;
    
    const transactionsRef = collection(db, 'transactions');
    const q = query(
        transactionsRef, 
        where('userId', '==', user.uid), 
        where('taskId', '==', taskId),
        orderBy('date', 'desc'),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const latestTx = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Transaction;
        setLatestTransaction(latestTx);
    } else {
        setLatestTransaction(null);
    }
  }, [user, taskId]);

  useEffect(() => {
    const fetchTask = async () => {
        if (!taskId) return;
        const taskDocRef = doc(db, 'tasks', taskId);
        const taskDoc = await getDoc(taskDocRef);

        if (taskDoc.exists()) {
            setTask({ id: taskDoc.id, ...taskDoc.data() } as Task);
        } else {
            console.error("No such task!");
            toast({ title: "Task not found", variant: "destructive" });
        }
    };
    fetchTask();
  }, [taskId, toast]);
  
  useEffect(() => {
    checkExistingTransaction();
  }, [user, taskId, checkExistingTransaction]);

  const isTaskLocked = useMemo(() => {
    return latestTransaction?.status === 'Paid';
  }, [latestTransaction]);

  const isTaskInProgress = useMemo(() => {
    return latestTransaction?.status === 'Started & Ongoing' || latestTransaction?.status === 'Approved';
  }, [latestTransaction]);


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

  const openTaskLink = (taskLink: string) => {
    let url = taskLink;
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    window.open(url, '_blank');
  }

  const handleStartTask = async () => {
    if (!user || !task || isTaskLocked || isStarting) return;

    setIsStarting(true);
    
    try {
        if (!appUser || !appUser.phone || !appUser.upiId) {
            toast({
                title: "Profile Incomplete",
                description: "Please complete your profile with phone and UPI ID before starting a task.",
                variant: "destructive"
            });
            router.push(`/profile?redirect_to=${pathname}`);
            setIsStarting(false);
            return;
        }

        // If task is already in progress, just open the link and don't create a new transaction
        if (isTaskInProgress) {
            openTaskLink(task.link);
            toast({
                title: "Continuing Task",
                description: "Opening the task link for you to continue.",
            });
            setIsStarting(false);
            return;
        }


        const newTransaction: Omit<Transaction, 'id'> = {
            userId: user.uid,
            taskId: task.id,
            title: task.name,
            amount: task.reward,
            status: 'Started & Ongoing',
            date: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'transactions'), newTransaction);

        toast({
            title: "Task Started!",
            description: `"${task.name}" is now ongoing. Check your wallet for status updates.`,
        });
        
        // After successfully creating the transaction, redirect to wallet
        router.push('/wallet');

        // Open the link in a new tab
        if (task.link) {
           openTaskLink(task.link);
        }

    } catch (error) {
        console.error("Error starting task:", error);
        toast({ title: "Error", description: "Could not start the task.", variant: "destructive" });
    } finally {
        setIsStarting(false);
    }
  };

  const stepsArray = typeof task.steps === 'string' ? task.steps.split('\n').filter(s => s.trim() !== '') : [];

  const getButtonContent = () => {
      if (isStarting) {
          return <> <Loader2 className="mr-2 animate-spin" /> Starting Task...</>;
      }
      if (!user) {
          return "Login to Start Task";
      }
      if (isTaskLocked) {
          return `Task Paid`;
      }
      if (isTaskInProgress) {
          return `Continue Task & Earn ₹${task.reward}`;
      }
      return `Start Task & Earn ₹${task.reward}`;
  }

  const handleButtonClick = () => {
    if (!user) {
      router.push(`/profile?redirect_to=${pathname}`);
      return;
    }
    handleStartTask();
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow py-4 space-y-4">
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

             <Button 
                size="lg" 
                className="w-full shadow-lg" 
                onClick={handleButtonClick}
                disabled={isTaskLocked || isStarting}
              >
                {getButtonContent()}
            </Button>
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
