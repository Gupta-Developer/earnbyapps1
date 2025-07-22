
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { transactions as allTransactions, users } from "@/lib/data";
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="currentColor"
    >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2 22l5.25-1.38c1.41.79 3.02 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.92-9.91zM17.43 15.25c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06s-1.03-.38-1.95-1.2-1.48-1.58-1.72-1.84c-.24-.26-.01-.39.11-.5.11-.1.24-.26.36-.4.12-.14.16-.24.24-.4s.04-.3-.02-.42c-.06-.12-.54-1.29-.74-1.77s-.4-.41-.54-.41-.28-.01-.42-.01h-.12c-.14,0-.38.06-.58.3s-.78.76-.78 1.84.8 2.13.92 2.29.78 2.43 2.82 3.53c.46.26.83.41 1.12.52.5.18.95.16 1.3.1.39-.06 1.42-.58 1.62-1.14.2-.56.2-.94.14-1.14s-.22-.3-.46-.42z"></path>
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
  // Rerender component when transactions change
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions);

  useEffect(() => {
    // This is a trick to force re-render when the underlying data changes.
    // In a real app, you would use a state management library.
    const interval = setInterval(() => {
       if (transactions.length !== allTransactions.length) {
         setTransactions([...allTransactions]);
       }
    }, 500);
    return () => clearInterval(interval);
  }, [transactions]);


  // Assuming user is the first user for demo purposes
  const currentUserId = 1;
  const userTransactions = transactions.filter(t => t.userId === currentUserId);

  const totalEarnings = userTransactions
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
              {userTransactions.length > 0 ? userTransactions.map((item) => (
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
                    No transactions yet.
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
