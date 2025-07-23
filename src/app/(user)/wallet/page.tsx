
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
        <path d="M19.05 4.94A10 10 0 0 0 12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.45 1.26 4.94L2 22l5.06-1.26A10.02 10.02 0 0 0 12 22a10 10 0 0 0 10-10c0-2.76-1.12-5.26-2.95-7.06zm-7.05 15.08c-1.63 0-3.18-.5-4.5-1.36L6 19.12l.4-1.42c-.93-1.4-1.4-3.03-1.4-4.7s.47-3.3 1.4-4.7l-.4-1.42 1.42-.4C8.82 5.5 10.37 5 12 5s3.18.5 4.5 1.36l1.42.4.4 1.42c.93 1.4 1.4 3.03 1.4 4.7s-.47 3.3-1.4 4.7l-.4 1.42-1.42-.4c-1.32.86-2.87 1.36-4.5 1.36zm3.3-4.83c-.1-.05-.62-.3-1.07-.54s-.3-.23-.42-.54.05-.54.15-.64.42-.3.54-.42.23-.23.1-.42c-.1-.23-.42-.54-.54-.64s-.23-.1-.42-.1h-.42c-.23 0-.42.1-.64.3s-.84.84-1.07 1.95c-.23 1.12.23 2.18.42 2.38.2.2.84.84 2.07 1.45.3.15.54.23.74.3.3.1.54.05.74-.05.2-.1.84-.3 1.07-.64.23-.3.23-.64.15-.74s-.1-.23-.23-.23z"/>
    </svg>
);

const statusFaqs = [
    {
        question: "What does 'Under Verification' mean?",
        answer: "Your task submission has been received and is currently being reviewed by our team to ensure all steps were completed correctly. This process usually takes 24-48 hours."
    },
    {
        question: "What does 'Approved' mean?",
        answer: "Congratulations! Your task has been successfully verified by our team. The reward amount has been approved and is now scheduled for payout in the next payment cycle."
    },
     {
        question: "What does 'Paid' mean?",
        answer: "The reward for this task has been successfully sent to the UPI ID registered in your profile. You can check your bank account to confirm the transaction."
    },
    {
        question: "What does 'Rejected' mean?",
        answer: "Unfortunately, your submission did not meet the required criteria for the task. This could be due to incomplete steps, incorrect information, or other issues. Please contact our support for more details if needed."
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
        <h2 className="text-lg font-semibold mb-2 px-1">Task History</h2>
        <Card className="shadow-md rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Details</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? transactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.app}</div>
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
                        <a href={`https://wa.me/918319250462?text=Hi, I have a question about my task: ${item.app}`} target="_blank" rel="noopener noreferrer">
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
