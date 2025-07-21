
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
        <path d="M16.75 13.96c.25.41.41.83.41 1.25 0 .41-.08.83-.25 1.25-.17.41-.42.75-.75 1.08s-.75.58-1.17.75c-.41.17-.83.25-1.25.25-.41 0-1.08-.08-1.5-.25s-1.08-.41-1.58-.75c-.5-.33-1.08-.75-1.58-1.17s-.92-1-1.25-1.58c-.33-.58-.58-1.17-.75-1.75s-.25-1.17-.25-1.75.08-1.17.25-1.75.41-1.08.75-1.58c.33-.5.75-1 1.25-1.41.5-.42 1-.75 1.58-.92.58-.17 1.17-.25 1.75-.25.58 0 1.17.08 1.75.25s1.08.41 1.58.75c.5.34.92.75 1.25 1.25s.58 1 .75 1.58c.17.58.25 1.17.25 1.75s-.08 1.17-.25 1.75-.42 1.08-.75 1.58z M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="M19.07 4.93a10 10 0 0 0-14.14 0 10 10 0 0 0 0 14.14 10 10 0 0 0 14.14 0 10 10 0 0 0 0-14.14zM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
        <path d="m17.5 6.5-11 11" />
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
      <Card className="shadow-md rounded-lg w-full">
            <CardHeader>
                <CardTitle>Understanding Statuses</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {statusFaqs.map((faq, index) => (
                         <AccordionItem value={`item-${index}`} key={index} className="border-b-0 border-t">
                            <AccordionTrigger className="text-left hover:no-underline rounded-lg px-4 data-[state=open]:bg-secondary/50">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pt-2 px-4 pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    </div>
  );
}
