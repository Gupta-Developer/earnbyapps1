
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Gift } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

export default function SharePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartTask = async () => {
    // This is where you would normally interact with a database.
    console.log(`Sharing task for user ${user!.id}`);
    
    // Construct the referral link
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/profile?ref=${user!.id}`;
    const message = `Hey! I'm earning money by completing simple tasks on EarnByApps. Join me and earn rewards! Use my referral link: ${referralLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const steps = [
      "Click the 'Start Task' button below.",
      "Share the link with your friends on WhatsApp.",
      "When your friend signs up and completes a task, you'll get ₹5!",
      "The reward will be added to your wallet automatically."
  ];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-grow py-4 space-y-4">
        <Card className="shadow-md rounded-lg w-full overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                 <div className="w-[70px] h-[70px] rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gift className="w-10 h-10 text-primary" />
                </div>
                  <div>
                    <h2 className="font-bold text-2xl">EarnByApps</h2>
                    <p className="text-accent font-semibold text-xl mt-1">Earn ₹5</p>
                  </div>
              </div>
              <p className="text-muted-foreground text-sm">Share this app with your friends and earn a reward for every friend who joins and completes their first task.</p>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Steps to Follow:</h3>
              <ul className="space-y-4">
                  {steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                          <span className="text-foreground text-sm">{step}</span>
                      </li>
                  ))}
              </ul>
            </div>
            
            <Separator />

            {user ? (
                <Button size="lg" className="w-full shadow-lg" onClick={handleStartTask}>
                    Start Task &amp; Earn ₹5
                </Button>
            ) : (
                <Button size="lg" className="w-full shadow-lg" onClick={() => router.push('/profile?redirect_to=/share')}>
                    Login to Start Task
                </Button>
            )}
          </div>
        </Card>
      </main>

    </div>
  );
}
