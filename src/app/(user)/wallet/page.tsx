
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
        <path d="M16.75 13.96c.25.13.41.33.41.55v.02c0 .22-.04.43-.12.63s-.2.38-.34.54c-.14.16-.3.29-.48.4s-.38.19-.59.24c-.21.05-.43.06-.65.04s-.43-.08-.63-.18c-.2-.09-.38-.22-.56-.37s-.34-.3-.5-.47c-.16-.17-.32-.34-.47-.51s-.28-.34-.42-.51c-.13-.17-.26-.34-.38-.51s-.22-.33-.32-.48c-.1-.15-.19-.29-.26-.43s-.14-.27-.18-.4c-.05-.13-.08-.26-.09-.39s0-.26.02-.39c.02-.13.05-.25.1-.37s.1-.23.17-.33c.07-.1.14-.19.23-.27.09-.08.18-.15.28-.2s.2-.09.3-.12.2-.05.3-.06c.1-.01.2-.01.3 0 .1.01.19.02.28.05.09.02.18.05.26.09.08.04.16.08.23.13.07.05.14.1.2.16.06.06.12.12.17.18.05.06.09.13.12.2.03.07.06.14.07.22s.02.16,0 .24c-.02.08-.05.16-.09.23-.04.07-.08.14-.13.2s-.1.12-.16.17c-.06.05-.12.1-.17.14s-.1.08-.13.1c-.04.03-.06.06-.08.08-.02.02-.02.05-.02.07s.01.04.02.06c.01.02.03.03.05.05.02.01.04.03.06.04s.04.03.07.04.05.02.08.03.06.02.09.02c.03,0,.07,0,.1-.01s.06-.01.09-.02c.03-.01.07-.02.1-.04.03-.01.07-.03.1-.05s.06-.04.1-.06.07-.05.1-.08.06-.06.1-.09c.03-.03.07-.06.1-.1.03-.04.06-.07.08-.11.03-.04.05-.08.06-.13.01-.05.02-.1.02-.15s0-.1-.01-.14c0-.05-.01-.09-.02-.13s-.03-.08-.05-.12c-.02-.04-.04-.08-.06-.11s-.05-.07-.08-.1c-.03-.03-.06-.06-.08-.08s-.05-.04-.08-.06-.06-.03-.09-.04-.06-.02-.1-.02c-.07-.02-.15-.02-.22,0zM10.87 12.3c.02.03.04.06.06.09.02.03.05.06.07.09.02.03.05.06.08.09.03.03.06.06.09.09.03.03.07.05.1.08.04.03.08.06.12.08.04.03.09.05.13.07.05.02.09.04.14.05.05.01.1.02.15.03.05,0,.1,0,.15,0,.05,0,.1,0,.15,0,.05,0,.1,0,.15-.01.05,0,.1,0,.15-.01.05,0,.1,0,.14-.02.05-.01.09-.02.14-.04s.09-.04.13-.06.09-.05.13-.08c.04-.03.08-.06.12-.09.04-.03.08-.07.11-.11.03-.04.07-.08.09-.12.03-.04.05-.09.07-.14.02-.05.03-.1.04-.15.01-.05.01-.1.01-.15s0-.1-.01-.15-.02-.1-.04-.15c-.01-.05-.03-.1-.06-.14-.02-.05-.05-.09-.08-.13-.03-.04-.07-.08-.11-.11-.04-.03-.08-.06-.12-.09-.05-.03-.09-.05-.14-.07-.05-.02-.1-.04-.15-.05-.05-.01-.1-.02-.15-.02-.05,0-.1,0-.15,0s-.1,0-.15,0c-.05,0-.1,0-.15.01s-.1.02-.14.03c-.05.01-.09.03-.14.05-.05.02-.09.04-.13.06-.04.03-.08.05-.12.08-.04.03-.08.06-.11.09-.03.03-.07.06-.09.1-.03.03-.05.07-.07.11-.02.04-.04.08-.05.12-.01.05-.02.09-.02.14z"/>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
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
