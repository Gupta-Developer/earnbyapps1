
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ShieldAlert } from "lucide-react";
import { Transaction, TaskStatus, User, Task } from "@/lib/types";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const { toast } = useToast();
  const { isAdmin, loading } = useAuth();

  const fetchData = async () => {
    try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData: Record<string, User> = {};
        usersSnapshot.forEach((doc) => {
            usersData[doc.id] = { id: doc.id, ...doc.data() } as User;
        });
        setUsers(usersData);

        // Fetch all tasks
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        const tasksData: Record<string, Task> = {};
        tasksSnapshot.forEach((doc) => {
            tasksData[doc.id] = { id: doc.id, ...doc.data() } as Task;
        });
        setTasks(tasksData);

        // Fetch all transactions
        const transactionsSnapshot = await getDocs(collection(db, "transactions"));
        const transactionsData = transactionsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamps to JS Dates
                date: data.date ? (data.date as any).toDate() : new Date(),
            } as Transaction;
        });
        
        setTransactions(transactionsData);
    } catch (error) {
        console.error("Error fetching data:", error);
        toast({
            title: "Error Fetching Data",
            description: "Could not load required data from Firestore.",
            variant: "destructive"
        });
    }
  };

  useEffect(() => {
    if (isAdmin) {
        fetchData();
    }
  }, [isAdmin]);


  const handleStatusChange = (transactionId: string, newStatus: TaskStatus) => {
    setTransactions(prev => 
      prev.map(t => t.id === transactionId ? { ...t, status: newStatus } : t)
    );
  };

  const handleSaveChanges = async () => {
    const batch = writeBatch(db);
    transactions.forEach(transaction => {
      const { id, ...data } = transaction;
      if (id) {
          const transactionRef = doc(db, "transactions", id);
          batch.update(transactionRef, { status: data.status });
      }
    });

    try {
        await batch.commit();
        toast({
            title: "Changes Saved",
            description: "All task statuses have been updated.",
            className: "bg-accent text-accent-foreground border-accent"
        });
    } catch (e) {
        console.error("Error saving changes: ", e);
        toast({
            title: "Error",
            description: "Could not save changes.",
            variant: "destructive"
        })
    }
  };

  const getUserById = (id: string) => users[id];
  const getTaskById = (id: string) => tasks[id];

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    )
  }

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
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage user tasks and statuses.</p>
                </div>
                 <Button asChild>
                    <Link href="/admin/add-task">
                        <PlusCircle className="mr-2" />
                        Add New Task
                    </Link>
                </Button>
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
                                {transactions.length > 0 ? transactions.map((transaction) => {
                                    const user = getUserById(transaction.userId);
                                    const task = getTaskById(transaction.taskId);
                                    if (!user || !task) return null;

                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">{user.fullName}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">{user.phone || "N/A"}</div>
                                                <div className="text-xs text-muted-foreground">{user.upiId || "N/A"}</div>
                                            </TableCell>
                                            <TableCell>{task.name}</TableCell>
                                            <TableCell>
                                            <Select
                                                value={transaction.status}
                                                onValueChange={(value: TaskStatus) => handleStatusChange(transaction.id as string, value)}
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
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No transactions to display.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} size="lg" className="shadow-md" disabled={transactions.length === 0}>Save Changes</Button>
            </div>
        </div>
    </div>
  );
}

