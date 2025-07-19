
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
       <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">About Us</h1>
      </header>
      <main className="flex-grow p-4">
        <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>
                    Welcome to EarnByApps! Our mission is to provide a simple and effective platform for users to earn real rewards by completing engaging tasks. We partner with exciting app developers and brands to bring you opportunities to discover new apps while getting paid for your time and feedback.
                </p>
                <p>
                    We believe in a transparent and fair system. Every task you see has clear instructions and a defined reward. Our platform is designed to be user-friendly, secure, and rewarding.
                </p>
                <p>
                    Join our community and start earning today!
                </p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
