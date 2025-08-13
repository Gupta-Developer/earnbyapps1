
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
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';


export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const { user } = useAuth();
  const taskId = params.id as string;
  const [task, setTask] = useState<Task | null>(null);
  const [existingTransaction, setExistingTransaction] = useState<Transaction | null>(null);
  const [isStarting, setIsStarting] = useState(false);


  const checkExistingTransaction = useCallback(async () => {
    if (!user || !taskId) return;
    
    const transactionsRef = collection(db, "users", user.uid, "transactions");
    const q = query(transactionsRef, where("taskId", "==", taskId));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
        const transactionDoc = querySnapshot.docs[0];
        setExistingTransaction({ id: transactionDoc.id, ...transactionDoc.data() } as Transaction);
    } else {
        setExistingTransaction(null);
    }
  }, [user, taskId]);

  useEffect(() => {
    const fetchTask = async () => {
        if (!taskId) return;
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (taskSnap.exists()) {
            setTask({ id: taskSnap.id, ...taskSnap.data() } as Task);
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
    return existingTransaction?.status === 'Paid' || existingTransaction?.status === 'Approved';
  }, [existingTransaction]);


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
    if (!user || isTaskLocked || existingTransaction || isStarting) return;
    
    setIsStarting(true);
    
    try {
        // Double-check for transaction right before writing
        const transactionsRefCheck = collection(db, "users", user.uid, "transactions");
        const qCheck = query(transactionsRefCheck, where("taskId", "==", taskId));
        const querySnapshotCheck = await getDocs(qCheck);

        if (!querySnapshotCheck.empty) {
            setExistingTransaction({ id: querySnapshotCheck.docs[0].id, ...querySnapshotCheck.docs[0].data() } as Transaction);
            setIsStarting(false);
            toast({ title: "Task already started", description: "You can view its status in your wallet.", variant: "default" });
            router.push('/wallet');
            return;
        }


        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().phone || !userSnap.data().upiId) {
            toast({
                title: "Profile Incomplete",
                description: "Please complete your profile with phone and UPI ID before starting a task.",
                variant: "destructive"
            });
            router.push(`/profile?redirect_to=${pathname}`);
            setIsStarting(false);
            return;
        }

        const transactionsRef = collection(db, "users", user.uid, "transactions");
        const newTransactionRef = doc(transactionsRef);
        
        await setDoc(newTransactionRef, {
            taskId: task.id,
            title: task.name,
            amount: task.reward,
            status: 'Started & Ongoing',
            date: serverTimestamp(),
        });

        toast({
            title: "Task Started!",
            description: `"${task.name}" is now ongoing in your wallet.`,
        });
        
        await checkExistingTransaction();

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
          return <> <Loader2 className="animate-spin" /> Starting Task...</>;
      }
      if (!user) {
          return "Login to Start Task";
      }
      if (isTaskLocked) {
          return `Task ${existingTransaction?.status}`;
      }
      if (existingTransaction) {
           return `View Task Status`;
      }
      return `Start Task & Earn ₹${task.reward}`;
  }

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

            {user ? (
                <Button 
                  asChild={!isTaskLocked && !existingTransaction && !isStarting} 
                  size="lg" 
                  className="w-full shadow-lg" 
                  onClick={() => {
                      if(existingTransaction) {
                          router.push('/wallet')
                      } else {
                          handleStartTask();
                      }
                  }}
                  disabled={isTaskLocked || isStarting}
                >
                    {isTaskLocked || (existingTransaction && !task.link) || isStarting ? (
                        <span>{getButtonContent()}</span>
                    ) : (
                         <a href={task.link} target="_blank" rel="noopener noreferrer" onClick={handleStartTask}>
                            {getButtonContent()}
                        </a>
                    )}
                </Button>
            ) : (
                <Button size="lg" className="w-full shadow-lg" onClick={() => router.push(`/profile?redirect_to=${pathname}`)}>
                    {getButtonContent()}
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
