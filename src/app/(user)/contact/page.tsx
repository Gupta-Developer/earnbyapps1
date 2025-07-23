
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
        <path d="M16.75 13.96c.25.13.42.2.46.3.05.1.05.62-.15 1.18-.18.56-1.15 1.08-1.52 1.12-.37.04-1.12.2-1.68-.05-.56-.24-1.3-.5-2.25-1.04s-1.7-1.12-2.3-1.78c-.6- .65-1.03-1.3-1.12-1.52-.1-.23-.1-1.03.05-1.55.15-.52.54-.7.7-.82.15-.12.3-.15.42-.15h.3c.12 0 .3.03.45.23.15.2.42.78.47.82.04.05.07.12.02.23-.05.12-.1.2-.23.32s-.2.2-.3.35c-.1.15-.12.2-.05.32.07.13.23.32.42.5.18.2.4.42.62.62.23.2.47.4.73.54.26.15.42.2.5.23.1.04.14 0 .23-.05.1-.05.42-.47.54-.58.12-.12.23-.18.35-.18s.25-.05.35.02c.1.07.47.75.56.9.1.13.15.2.1.32-.05.12-.12.18-.23.23-.1.05-.2.1-.25.13zM12 2a10 10 0 0 0-10 10c0 1.77.46 3.45 1.26 4.94L2 22l5.06-1.26a10 10 0 0 0 4.94 1.26h.02c5.5 0 10-4.5 10-10s-4.5-10-10-10z"/>
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
