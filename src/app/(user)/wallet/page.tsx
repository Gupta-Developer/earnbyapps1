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
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.48 1.32 4.95L2.05 22l5.25-1.38c1.41.79 3.02 1.22 4.74 1.22 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM9.53 8.5c.22-.66 1.33-1.22 2.23-1.22.64 0 1.22.18 1.63.88.42.7.45 1.73.13 2.58-.32.85-1.19 1.41-1.92 1.41-.33 0-.64-.09-.88-.22-.24-.13-.48-.3-.68-.5-.2-.19-.38-.41-.53-.64-.15-.23-.29-.48-.39-.73s-.18-.5-.22-.76c-.04-.26 0-.52.09-.76s.22-.48.39-.7.38-.41.59-.59c.22-.19.48-.34.76-.48.29-.14.59-.22.91-.22.32 0 .63.08.91.22s.53.34.75.59c.22.25.39.54.53.85.13.32.2.66.2.99s-.07.66-.2.98c-.13.32-.31.62-.53.88-.22.26-.48.5-.78.68-.3.19-.64.31-1.02.38-.38.07-.77.07-1.15 0-.38-.07-.73-.2-1.05-.38-.32-.19-.6-.41-.83-.68-.23-.27-.42-.56-.56-.88-.14-.32-.23-.66-.25-.99s0-.66.09-.98c.09-.32.23-.62.41-.88.19-.26.41-.5.66-.68.25-.19.53-.31.83-.38.3-.07.62-.07.94 0 .32.07.62.2.88.38.26.19.48.41.66.68.19.27.32.56.41.88.09.32.13.66.09.98s-.13.64-.26.94c-.13.3-.31.58-.53.82-.22.24-.48.45-.76.62-.29.17-.6.29-.93.34-.33.05-.66.04-.99-.02-.33-.06-.64-.18-.93-.34-.29-.16-.55-.37-.78-.62s-.42-.54-.56-.85c-.14-.32-.22-.66-.22-1.01 0-.35.07-.68.22-1.01.14-.32.34-.62.59-.85.25-.23.54-.42.85-.56.32-.14.66-.22 1.01-.22s.7.08 1.01.22c.32.14.6.34.85.56.25.23.45.5.59.85.14.32.22.66.22 1.01z"/>
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
    .filter(t => t.status === 'Paid' || t.status === 'Approved')
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
                <TableHead>Task</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Support</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTransactions.length > 0 ? userTransactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.app}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">₹{item.amount}</div>
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
                  <TableCell className="text-right">{format(item.date, 'dd MMM, yy')}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
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
