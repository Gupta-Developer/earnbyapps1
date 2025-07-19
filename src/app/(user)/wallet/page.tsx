
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { transactions as allTransactions, users } from "@/lib/data";
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";

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
      <title>WhatsApp</title>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2.05 22l5.25-1.38c1.41.79 3.02 1.22 4.74 1.22 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM17.62 15.2c-.23.41-.85.76-1.47.91-.62.15-1.23.2-1.8.1-1.12-.2-2.12-.74-2.98-1.5-.96-.85-1.63-1.9-1.93-3.08-.21-.85-.1-1.6.32-2.31.3-.5.7-.75 1.13-.9.42-.15.86-.1 1.28.08.35.15.6.45.75.8.15.35.15.75.1 1.1-.05.35-.15.7-.3.95-.15.25-.3.45-.5.6s-.4.3-.6.35c-.2.05-.4.1-.6.05-.2-.05-.4-.1-.6-.2s-.35-.2-.5-.35c-.15-.15-.3-.3-.4-.5s-.2-.4-.25-.6c-.05-.2-.05-.4.05-.6.1-.2.25-.35.45-.5s.4-.25.65-.3c.25-.05.5-.05.7,0s.4.1.55.25.25.3.35.5.15.35.2.55.05.4,0 .6-.05.4-.15.55c-.1.15-.2.3-.35.4s-.3.2-.45.25c-.15.05-.3.05-.45,0-.15,0-.3-.05-.4-.1s-.2-.15-.3-.2c-.1-.05-.2-.1-.25-.2-.05-.05-.1-.1-.15-.15-.05-.05-.1-.1-.1-.15s-.05-.1-.05-.15c0-.05,0-.1.05-.15s.05-.1.1-.15.1-.05.15-.05.1,0,.15,0c.05,0,.1,0,.15,0s.1,0,.15,0 .1,0,.15,0 .1,0,.15-.05.1-.05.15-.05.1,0,.15,0 .1,0,.15,0 .1,0,.15,0 .1,0,.15,0c.05,0,.1,0,.15,0s.1,0,.1,0 .05,0,.1,0 .05,0,.05,0 .05,0,.05,0 .05,0,.05,0 .05,0,0,0c.05,0,0,0,0,0,.35,0,.65-.15.9-.45.25-.3.45-.7.5-1.15.05-.45,0-.9-.1-1.35s-.3-.85-.5-1.2c-.2-.35-.5-.65-.85-.85s-.75-.3-1.15-.3-1.2.1-1.7.4c-.5.3-1,.7-1.3,1.2-.3.5-.5,1.05-.6,1.65-.1.6-.05,1.2.15,1.75.2.55.5,1.05.9,1.5.4.45.85.8,1.35,1.1.5.3,1.05.5,1.6.6.55.1,1.1.1,1.65,0 .6-.1,1.1-.35,1.5-.75.3-.3.5-.7.6-1.15.05-.3.05-.6,0-.85-.05-.25-.15-.5-.3-.7-.15-.2-.35-.35-.55-.45-.2-.1-.45-.1-.65,0-.2.05-.4.15-.55.3-.15.15-.25.3-.3.5s-.1.4-.05.6.1.4.2.55c.1.15.25.3.4.35s.3.1.5,0c.15-.05.3-.15.4-.25.1-.1.2-.2.25-.35s.1-.3.1-.45,0-.3-.05-.45c-.05-.15-.1-.3-.2-.4s-.15-.2-.25-.25-.2-.1-.3-.1-.2,0-.3.05c-.1.05-.2.1-.25.2s-.1.15-.15.25c-.05.1-.05.15-.05.25s0,.2.05.3.1.15.15.25.15.15.2.2c.05.05.1.1.15.1s.1.05.15.05c.05,0,.1,0,.1,0s.05,0,.1,0 .05,0,.1,0 .05,0,.05,0 .05,0,0,0 .05,0,0,0h0c.05,0,0,0,0,0z"/>
    </svg>
  );

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
    </div>
  );
}
