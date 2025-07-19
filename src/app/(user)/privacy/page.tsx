
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
    const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex items-center gap-4 sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold text-foreground truncate">Privacy Policy</h1>
      </header>
       <main className="flex-grow p-4 space-y-4">
        <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Data Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>We collect information you provide directly to us, such as when you create an account, complete a task, or contact us for support. This may include your name, email address, phone number, and UPI ID.</p>
            </CardContent>
        </Card>
         <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Data Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to operate, maintain, and provide you with the features and functionality of the service, to process your earnings, and to communicate with you.</p>
            </CardContent>
        </Card>
        <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Data Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., processing payments) or as required by law.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
