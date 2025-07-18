
"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { tasks, transactions, users } from '@/lib/data';
import { Transaction } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

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
    // For demo, we'll assume the first user is logged in.
    const currentUser = users[0];

    // Check if task is already started
    const existingTask = transactions.find(t => t.taskId === task.id && t.userId === currentUser.id);
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
      userId: currentUser.id,
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

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">{task.name}</h1>
      </header>
      
      <main className="flex-grow p-4">
        <Card className="shadow-md rounded-lg w-full">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center text-center gap-4">
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
          </CardContent>
        </Card>
      </main>

      <footer className="p-4 sticky bottom-0 bg-card/80 backdrop-blur-sm z-10 border-t">
        <Button onClick={handleStartTask} size="lg" className="w-full shadow-lg">Start Task & Earn ₹{task.reward}</Button>
      </footer>
    </div>
  );
}
