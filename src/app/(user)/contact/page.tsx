
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">Contact Us</h1>
      </header>
       <main className="flex-grow p-4">
        <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                    Have questions or need support? We're here to help! Reach out to us through one of the methods below.
                </p>
                <a href="mailto:support@earnbyapps.com" className="block">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <Mail className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">Email Us</p>
                            <p className="text-sm text-muted-foreground">support@earnbyapps.com</p>
                        </div>
                    </div>
                </a>
                 <a href="https://wa.me/918319250462" target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">WhatsApp Support</p>
                            <p className="text-sm text-muted-foreground">Chat with us directly</p>
                        </div>
                    </div>
                </a>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
