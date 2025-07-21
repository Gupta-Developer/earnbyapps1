
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
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary"
                            fill="currentColor"
                        >
                            <path d="M16.75 13.96c.25.41.41.83.41 1.25 0 .41-.08.83-.25 1.25-.17.41-.42.75-.75 1.08s-.75.58-1.17.75c-.41.17-.83.25-1.25.25-.41 0-1.08-.08-1.5-.25s-1.08-.41-1.58-.75c-.5-.33-1.08-.75-1.58-1.17s-.92-1-1.25-1.58c-.33-.58-.58-1.17-.75-1.75s-.25-1.17-.25-1.75.08-1.17.25-1.75.41-1.08.75-1.58c.33-.5.75-1 1.25-1.41.5-.42 1-.75 1.58-.92.58-.17 1.17-.25 1.75-.25.58 0 1.17.08 1.75.25s1.08.41 1.58.75c.5.34.92.75 1.25 1.25s.58 1 .75 1.58c.17.58.25 1.17.25 1.75s-.08 1.17-.25 1.75-.42 1.08-.75 1.58z M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                            <path d="M19.07 4.93a10 10 0 0 0-14.14 0 10 10 0 0 0 0 14.14 10 10 0 0 0 14.14 0 10 10 0 0 0 0-14.14zM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                            <path d="m17.5 6.5-11 11" />
                        </svg>
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
