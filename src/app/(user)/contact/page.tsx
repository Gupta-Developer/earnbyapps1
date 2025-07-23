
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
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2 22l5.05-1.32c1.47.86 3.16 1.32 4.95 1.32h.01c5.46 0 9.91-4.45 9.91-9.91c0-5.46-4.45-9.91-9.91-9.91zM12.04 20.57c-1.63 0-3.17-.5-4.45-1.36l-.32-.19-3.3 1.05 1.07-3.23-.22-.34a8.42 8.42 0 0 1-1.28-4.59c0-4.69 3.81-8.5 8.5-8.5s8.5 3.81 8.5 8.5c0 4.69-3.81 8.5-8.5 8.5zM16.51 14.49c-.22-.11-1.3-.64-1.5-.72s-.35-.11-.5.11c-.15.22-.57.72-.7.86s-.25.17-.45.06c-.2-.12-.85-.31-1.61-1s-1.29-1.24-1.41-1.45c-.12-.22-.02-.34.09-.45s.22-.25.33-.37c.11-.12.15-.22.22-.37s.04-.27-.02-.37c-.06-.11-.5-1.21-.69-1.64s-.37-.36-.5-.36h-.41c-.2 0-.45.06-.68.31s-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.76 2.67 4.25 3.74s1.65.75 2.2.71c.71-.04 1.3-.53 1.48-.91s.18-.7.13-.81c-.05-.11-.19-.17-.4-.28z"/>
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
