
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
import WhatsAppIcon from "@/components/whatsapp-icon";

const getBadgeClasses = (status: string): string => {
    switch (status) {
        case 'Paid':
            return 'bg-accent text-accent-foreground border-transparent';
        case 'Approved':
            return 'bg-blue-500 text-white border-transparent';
        case 'Under Verification':
            return 'bg-yellow-500 text-white border-transparent';
        case 'Rejected':
            return 'bg-destructive text-destructive-foreground border-transparent';
        default:
            return 'bg-gray-500 text-white border-transparent';
    }
}

const statusFaqs = [
    {
        status: "Paid",
        question: "What does 'Paid' mean?",
        answer: "The reward for this item has been successfully sent to the UPI ID registered in your profile. You can check your bank account to confirm the transaction."
    },
    {
        status: "Approved",
        question: "What does 'Approved' mean?",
        answer: "Congratulations! Your submission has been successfully verified. The reward amount has been approved and is now scheduled for payout in the next payment cycle."
    },
    {
        status: "Under Verification",
        question: "What does 'Under Verification' mean?",
        answer: "Your task submission or referral is being reviewed by our team. This process usually takes 24-48 hours."
    },
    {
        status: "Rejected",
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
    <div className="py-4 space-y-6">
      <div className="pt-4 space-y-6">
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
                      <Badge className={getBadgeClasses(item.status)}>
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
                            <WhatsAppIcon className="h-4 w-4" />
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
        <div>
            <h2 className="text-lg font-semibold mb-2 px-1">Understanding Statuses</h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {statusFaqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/50 rounded-lg px-4 border-b-0">
                        <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-3">
                            <Badge className={getBadgeClasses(faq.status)}>
                                {faq.status}
                            </Badge>
                            <span>{faq.question}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-0 pb-4">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
}

    
