
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Copy, UserPlus, Gift, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MOCK_USERS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";


export default function ReferPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">Refer & Earn</h1>
      </header>
       <main className="flex-grow p-4">
         <Card className="shadow-md rounded-lg bg-secondary/50">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
                <UserPlus />
                Invite Friends, Earn Rewards
            </CardTitle>
            </CardHeader>
            <CardContent>
            {user && userPhoneNumber ? (
                <>
                <p className="text-muted-foreground text-sm mb-3">
                    Share your referral code with friends. When they sign up using your code, you both get a special bonus!
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

        <Card className="mt-6 shadow-md rounded-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                    <Gift />
                    How It Works
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">1</div>
                    <p>Share your unique referral code (your phone number) with your friends.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">2</div>
                    <p>Your friend enters your code in the 'Referral Code' field when they sign up.</p>
                </div>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">3</div>
                    <p>Once they complete their first task, you both receive a bonus reward in your wallets!</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

