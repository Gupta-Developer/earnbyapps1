
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
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.77.46 3.45 1.26 4.94l-1.38 5.25 5.37-1.38c1.44.77 3.06 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.24-.12-1.44-.71-1.67-.79s-.38-.12-.53.12-.62.79-.76.95c-.14.18-.29.18-.53.06s-1.04-.38-1.98-1.22c-.74-.65-1.23-1.47-1.38-1.71s-.03-.35.09-.47c.11-.11.24-.29.35-.44s.18-.24.27-.41c.09-.18.04-.32-.02-.44s-.53-1.29-.73-1.76c-.2-.47-.41-.41-.56-.41h-.47c-.15 0-.38.06-.59.29s-.79.76-.79 1.85c0 1.09.81 2.15.92 2.31s1.47 2.23 3.58 3.18c.5.24.9.38 1.2.47s.59.15.81.09c.27-.06.88-.36 1- .71s.12-.65.09-.71c-.03-.06-.18-.09-.41-.21z"/>
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
