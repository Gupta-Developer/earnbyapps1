
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Paid':
            return 'default'; // Uses accent color via custom css
        case 'Approved':
            return 'secondary';
        case 'Under Verification':
            return 'outline';
        case 'Rejected':
            return 'destructive';
        default:
            return 'destructive';
    }
}

const WhatsAppIcon = () => (
    <svg 
        viewBox="0 0 24 24" 
        className="h-4 w-4"
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.77.46 3.45 1.26 4.94l-1.38 5.25 5.37-1.38c1.44.77 3.06 1.23 4.79 1.23h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.5 14.3c-.24-.12-1.44-.71-1.67-.79s-.38-.12-.53.12-.62.79-.76.95c-.14.18-.29.18-.53.06s-1.04-.38-1.98-1.22c-.74-.65-1.23-1.47-1.38-1.71s-.03-.35.09-.47c.11-.11.24-.29.35-.44s.18-.24.27-.41c.09-.18.04-.32-.02-.44s-.53-1.29-.73-1.76c-.2-.47-.41-.41-.56-.41h-.47c-.15 0-.38.06-.59.29s-.79.76-.79 1.85c0 1.09.81 2.15.92 2.31s1.47 2.23 3.58 3.18c.5.24.9.38 1.2.47s.59.15.81.09c.27-.06.88-.36 1- .71s.12-.65.09-.71c-.03-.06-.18-.09-.41-.21z"/>
    </svg>
);

const statusFaqs = [
    {
        question: "What does 'Under Verification' mean?",
        answer: "Your task submission or referral is being reviewed by our team. This process usually takes 24-48 hours."
    },
    {
        question: "What does 'Approved' mean?",
        answer: "Congratulations! Your submission has been successfully verified. The reward amount has been approved and is now scheduled for payout in the next payment cycle."
    },
     {
        question: "What does 'Paid' mean?",
        answer: "The reward for this item has been successfully sent to the UPI ID registered in your profile. You can check your bank account to confirm the transaction."
    },
    {
        question: "What does 'Rejected' mean?",
        answer: "Unfortunately, your submission did not meet the required criteria. Please contact our support for more details if needed."
    }
]

export default function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) {
        setTransactions([]);
        return;
    };
    
    // In a real app, you'd fetch this from an API for the current user.
    // For now, we use mock data.
    const userTransactions = MOCK_TRANSACTIONS.filter(t => t.userId === user.id);
    setTransactions(userTransactions);

  }, [user]);

  const totalEarnings = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <Card className="text-center shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-accent">₹{totalEarnings.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-lg font-semibold mb-2 px-1">Earnings History</h2>
        <Card className="shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? transactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-accent">₹{item.amount}</div>
                    <div className="text-xs text-muted-foreground">{format(item.date, 'dd MMM, yyyy')}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(item.status)} className={item.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}>
                      {item.status}
                    </Badge>
                  </TableCell>
                   <TableCell>
                     <Button
                        variant="link"
                        className="p-0 h-auto text-xs text-muted-foreground gap-1"
                        asChild
                      >
                        <a href={`https://wa.me/918319250462?text=Hi, I have a question about my transaction: ${item.title}`} target="_blank" rel="noopener noreferrer">
                          <WhatsAppIcon />
                          Contact
                        </a>
                      </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                    No transactions yet. Start a task to see it here!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
       <div className="space-y-4">
            <h2 className="text-xl font-bold px-1">Understanding Statuses</h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {statusFaqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/50 rounded-lg px-4 border-b-0">
                        <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-0 pb-4">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </div>
  );
}

    