
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
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M18.4,6.5c-1.8-1.8-4.1-2.8-6.5-2.8C7.1,3.7,3.7,7.1,3.7,11.9c0,1.6,0.4,3.1,1.2,4.5l-1.3,4.6l4.8-1.3c1.4,0.7,2.9,1.1,4.5,1.1c4.8,0,8.7-3.9,8.7-8.7C21.3,10.6,20.2,8.3,18.4,6.5z M12,20.2c-1.5,0-3-0.5-4.3-1.3l-0.3-0.2l-3.2,0.9l0.9-3.1l-0.2-0.3c-0.9-1.4-1.4-3-1.4-4.7c0-3.9,3.2-7.1,7.1-7.1c1.9,0,3.7,0.8,5.1,2.1c1.3,1.3,2.1,3.1,2.1,5.1C20.6,17.1,17.5,20.2,12,20.2z M16.5,13.7c-0.2-0.1-1.2-0.6-1.4-0.7c-0.2-0.1-0.3-0.1-0.5,0.1c-0.1,0.2-0.5,0.7-0.7,0.8c-0.1,0.1-0.2,0.2-0.4,0.1c-0.2-0.1-0.8-0.3-1.5-0.9c-0.6-0.5-1-1.1-1.1-1.3c-0.1-0.2,0-0.3,0.1-0.4c0.1-0.1,0.2-0.3,0.3-0.4c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0-0.3-0.1-0.4c-0.1-0.1-0.5-1.1-0.7-1.5c-0.2-0.4-0.3-0.4-0.5-0.4h-0.4c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.8-0.8,1.9s0.8,2.2,0.9,2.4c0.1,0.2,1.6,2.5,4,3.5c0.6,0.2,1,0.4,1.4,0.5c0.6,0.2,1.2,0.1,1.6-0.1c0.5-0.2,0.8-0.8,0.7-1.5C16.8,13.9,16.7,13.8,16.5,13.7z"
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
