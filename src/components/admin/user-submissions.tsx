
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Transaction, TaskStatus, User } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface UserSubmissionsProps {
    initialTransactions: Transaction[];
    users: Record<string, User>;
}

export default function UserSubmissions({ initialTransactions, users }: UserSubmissionsProps) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        setTransactions(initialTransactions);
    }, [initialTransactions]);

    const handleStatusChange = (
        transactionId: string,
        newStatus: TaskStatus
    ) => {
        setTransactions((prev) =>
        prev.map((t) =>
            t.id === transactionId ? { ...t, status: newStatus } : t
        )
        );
    };

    const handleSaveChanges = async () => {
        console.log("Saving changes for transactions:", transactions);

        toast({
        title: "Changes Saved (Simulated)",
        description: "All task statuses have been updated.",
        className: "bg-accent text-accent-foreground border-accent",
        });
    };

    const getUserById = (id: string) => users[id];

    const filteredTransactions = useMemo(() => {
        if (!searchQuery) {
        return transactions;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        
        return transactions.filter(transaction => {
        const user = getUserById(transaction.userId);
        if (!user) return false;

        const nameMatch = user.fullName?.toLowerCase().includes(lowercasedQuery);
        const emailMatch = user.email?.toLowerCase().includes(lowercasedQuery);
        const phoneMatch = user.phone?.replace(/\D/g, '').includes(lowercasedQuery.replace(/\D/g, ''));
        
        return nameMatch || emailMatch || phoneMatch;
        });
    }, [searchQuery, transactions, users]);

    return (
        <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>User Submissions</CardTitle>
          <CardDescription>
            Review and update the status of user-submitted tasks and referrals. You can search by name, email, or phone.
          </CardDescription>
          <div className="pt-2">
             <Input 
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User & Task/Referral</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const user = getUserById(transaction.userId);
                    if (!user) return null;

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                           <div className="font-medium">{user.fullName}</div>
                           <div className="text-sm text-muted-foreground">{transaction.title}</div>
                           <div className="text-xs text-muted-foreground/80 mt-1">
                             {user.phone || 'No Phone'} &bull; {user.upiId || 'No UPI ID'}
                           </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={transaction.status}
                            onValueChange={(value: TaskStatus) =>
                              handleStatusChange(
                                transaction.id as string,
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Set status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under Verification">
                                Under Verification
                              </SelectItem>
                              <SelectItem value="Approved">
                                Approved
                              </SelectItem>
                              <SelectItem value="Rejected">
                                Rejected
                              </SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No submissions to display.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button
            onClick={handleSaveChanges}
            size="lg"
            className="shadow-md"
            disabled={transactions.length === 0}
          >
            Save All Changes
          </Button>
        </CardFooter>
      </Card>
    )
}
