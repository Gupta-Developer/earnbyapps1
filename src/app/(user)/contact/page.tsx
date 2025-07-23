
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
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
                          viewBox="0 0 24 24"
                          className="h-6 w-6 text-[#25D366]"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.05 4.94A10.02 10.02 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.44 1.32 4.95L2 22l5.05-1.32A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10 0-2.76-1.12-5.26-2.95-7.06zM12 20.5c-1.63 0-3.17-.5-4.45-1.36l-.32-.19-3.3 1.05 1.07-3.23-.22-.34A8.5 8.5 0 0 1 3.5 12c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5-3.81 8.5-8.5 8.5z"
                          />
                          <path
                            d="M16.47 14.35c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.86-.13.15-.25.17-.45.06-.2-.12-.85-.31-1.61-1-.6-.54-1-1.2-1.12-1.4-.12-.2-.02-.3.09-.4.1-.09.22-.25.33-.37.11-.12.15-.22.22-.37.07-.15.04-.27-.02-.37-.06-.1-.5-1.2-1.3-1.64s-1.45-.48-1.93-.48-1.64.48-1.64 1.45.62 3.4 1.87 4.54 2.87 2.15 4.93 2.15 2.18-.91 2.5-1.83.17-1.7-.05-1.93z"
                            fill="currentColor"
                          />
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
