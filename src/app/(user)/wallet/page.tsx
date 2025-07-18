"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { transactions as allTransactions, users } from "@/lib/data";
import { Transaction } from "@/lib/types";

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
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userTransactions.length > 0 ? userTransactions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.app}</TableCell>
                  <TableCell className="text-center">₹{item.amount}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getBadgeVariant(item.status)} className={item.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{format(item.date, 'dd MMM, yy')}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
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
