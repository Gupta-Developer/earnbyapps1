
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const WhatsAppIcon = () => (
    <svg 
        viewBox="0 0 24 24" 
        className="h-6 w-6 text-[#25D366]"
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19.05 4.94A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.26 4.94L2 22l5.06-1.26A10.02 10.02 0 0 0 12 22a10 10 0 0 0 10-10c0-2.76-1.12-5.26-2.95-7.06zm-7.05 15.08c-1.63 0-3.18-.5-4.5-1.36L6 19.12l.4-1.42c-.93-1.4-1.4-3.03-1.4-4.7s.47-3.3 1.4-4.7l-.4-1.42 1.42-.4C8.82 5.5 10.37 5 12 5s3.18.5 4.5 1.36l1.42.4.4 1.42c.93 1.4 1.4 3.03 1.4 4.7s-.47 3.3-1.4 4.7l-.4 1.42-1.42-.4c-1.32.86-2.87 1.36-4.5 1.36zm3.3-4.83c-.1-.05-.62-.3-1.07-.54s-.3-.23-.42-.54.05-.54.15-.64.42-.3.54-.42.23-.23.1-.42c-.1-.23-.42-.54-.54-.64s-.23-.1-.42-.1h-.42c-.23 0-.42.1-.64.3s-.84.84-1.07 1.95c-.23 1.12.23 2.18.42 2.38.2.2.84.84 2.07 1.45.3.15.54.23.74.3.3.1.54.05.74-.05.2-.1.84-.3 1.07-.64.23-.3.23-.64.15-.74s-.1-.23-.23-.23z"/>
    </svg>
);

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
                        <WhatsAppIcon />
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
