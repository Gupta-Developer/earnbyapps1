
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
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 12c0 1.77.46 3.45 1.26 4.94L2 22l5.25-1.38c1.44.77 3.06 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zM9.53 8.5c.24-.24.58-.24.82 0l.12.12c.12.12.18.3.12.47l-.24 1.07c-.06.24 0 .58.18.76l.65.65c.24.24.58.3.82.18l1.18-.42c.18-.06.35 0 .47.12l.71.71c.18.18.24.47.12.71l-.53 1.12c-.12.24-.3.35-.53.35h-.12c-.24 0-1.5-.3-2.83-1.62S8.14 11.26 8.14 11.02v-.12c0-.24.12-.41.35-.65l1.04-.71zm2.51 11.36h-.01c-1.88 0-3.68-.52-5.23-1.47l-.37-.22-3.89 1.02 1.04-3.8-.24-.39c-1.02-1.62-1.57-3.54-1.57-5.54 0-5.8 4.71-10.51 10.51-10.51s10.51 4.71 10.51 10.51-4.71 10.51-10.51 10.51z"/>
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
