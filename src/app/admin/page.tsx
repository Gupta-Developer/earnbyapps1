"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";
import { tasks, transactions as allTransactions, users } from "@/lib/data";
import { TaskStatus, Transaction } from "@/lib/types";

// In a real app, this would be based on user authentication and roles.
const isAdmin = true;

export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions);
  const { toast } = useToast();

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


  const handleStatusChange = (transactionId: number, newStatus: TaskStatus) => {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if(transaction) {
        transaction.status = newStatus;
        setTransactions([...allTransactions]);
    }
  };

  const handleSaveChanges = () => {
    // In a real app, this would send updates to the backend.
    // Here, the changes are already in the in-memory 'allTransactions' array.
    toast({
      title: "Changes Saved",
      description: "All task statuses have been updated.",
      className: "bg-accent text-accent-foreground border-accent"
    });
  };

  const getUserById = (id: number) => users.find(u => u.id === id);
  const getTaskById = (id: number) => tasks.find(t => t.id === id);


  if (!isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
            <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-lg text-muted-foreground mt-2">Only administrators can access this page.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 sm:p-8 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage user tasks and statuses.</p>
            </header>

            <Card className="shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle>User Task Management</CardTitle>
                    <CardDescription>Review and update the status of each user's task.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Task</TableHead>
                                    <TableHead className="w-[200px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => {
                                    const user = getUserById(transaction.userId);
                                    const task = getTaskById(transaction.taskId);
                                    if (!user || !task) return null;

                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">{user.fullName}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">{user.phone}</div>
                                                <div className="text-xs text-muted-foreground">{user.upiId}</div>
                                            </TableCell>
                                            <TableCell>{task.name}</TableCell>
                                            <TableCell>
                                            <Select
                                                value={transaction.status}
                                                onValueChange={(value: TaskStatus) => handleStatusChange(transaction.id, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Set status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Under Verification">Under Verification</SelectItem>
                                                    <SelectItem value="Approved">Approved</SelectItem>
                                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                                    <SelectItem value="Paid">Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} size="lg" className="shadow-md">Save Changes</Button>
            </div>
        </div>
    </div>
  );
}
