
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ShieldAlert, DollarSign, Users, ListChecks, Pencil, Trash2, Database } from "lucide-react";
import { Transaction, Task, User } from "@/lib/types";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import UserData from "@/components/admin/user-data";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, Timestamp, writeBatch } from "firebase/firestore";
import { MOCK_TASKS } from "@/lib/mock-data";


export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [isSeeding, setIsSeeding] = useState(false);
  
  const fetchData = useCallback(async () => {
    try {
        const [tasksSnapshot, usersSnapshot, transactionsSnapshot] = await Promise.all([
            getDocs(collection(db, "tasks")),
            getDocs(collection(db, "users")),
            getDocs(collection(db, "transactions"))
        ]);

        const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        setTasks(tasksList);

        const usersList: Record<string, User> = {};
        usersSnapshot.forEach(doc => {
            usersList[doc.id] = { id: doc.id, ...doc.data() } as User;
        });
        setUsers(usersList);
        
        const transactionsList = transactionsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                date: (data.date as Timestamp)?.toDate()
            } as Transaction
        });
        setTransactions(transactionsList);

    } catch (error) {
        console.error("Error fetching data:", error);
        toast({ title: "Error", description: "Could not fetch platform data.", variant: "destructive" });
    }
  }, [toast]);


  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, fetchData]);

  const handleDeleteTask = async (taskId: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      toast({
          title: "Task Deleted",
          description: "The task has been removed.",
      });
      fetchData(); // Refresh data
    } catch (error) {
        console.error("Error deleting task: ", error);
        toast({ title: "Error", description: "Could not delete the task.", variant: "destructive" });
    }
  };

  const handleSeedData = async () => {
    if (!isAdmin || isSeeding) return;
    setIsSeeding(true);

    try {
        const batch = writeBatch(db);
        const tasksCollection = collection(db, "tasks");

        MOCK_TASKS.forEach(task => {
            const docRef = doc(tasksCollection, task.id);
            // We remove the ID from the object itself before writing
            const { id, ...taskData } = task;
            batch.set(docRef, { ...taskData, createdAt: Timestamp.now() });
        });

        await batch.commit();

        toast({
            title: "Database Seeded!",
            description: `${MOCK_TASKS.length} mock tasks have been added.`,
            className: "bg-accent text-accent-foreground border-accent"
        });
        fetchData(); // Refresh the data
    } catch(error) {
        console.error("Error seeding data:", error);
        toast({ title: "Error", description: "Could not seed the database.", variant: "destructive" });
    } finally {
        setIsSeeding(false);
    }
  }

  const totalPlatformProfit = useMemo(() => {
    return transactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, transaction) => {
        const task = tasks.find(t => t.id === transaction.taskId);
        if (task && task.totalReward) {
            const profit = task.totalReward - task.reward;
            return sum + profit;
        }
        return sum;
    }, 0);
  }, [transactions, tasks]); 

  const totalUserPayout = useMemo(() => {
    return transactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);
  
  const totalTasks = useMemo(() => tasks.length, [tasks]);
  const totalUsers = useMemo(() => Object.keys(users).length, [users]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Only administrators can access this page.
        </p>
        <Button onClick={() => router.push("/")} className="mt-4">
          Go to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 pb-20">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Overview of your platform's activity.
            </p>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={handleSeedData} size="sm" variant="outline" disabled={isSeeding}>
                <Database className="mr-2 h-4 w-4" />
                {isSeeding ? 'Seeding...' : 'Seed Mock Data'}
            </Button>
            <Button asChild size="sm">
            <Link href="/admin/add-task">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
            </Link>
            </Button>
        </div>
      </header>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total User Payout</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{totalUserPayout.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Total earnings paid to users</p>
            </CardContent>
         </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Platform Profit</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{totalPlatformProfit.toFixed(2)}</div>
                 <p className="text-xs text-muted-foreground">Total earnings from all 'Paid' tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                 <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
         </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <ListChecks className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalTasks}</div>
                <p className="text-xs text-muted-foreground">Total available tasks</p>
            </CardContent>
         </Card>
      </div>
      
       <div className="flex flex-col gap-6">
         <Card>
          <CardHeader>
            <CardTitle>Manage Tasks</CardTitle>
            <CardDescription>
                {totalTasks} tasks available. View, edit, or delete them below.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {/* Mobile View: Card List */}
            <div className="md:hidden space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{task.name}</CardTitle>
                      <CardDescription>User Payout: ₹{task.reward}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex items-center gap-2 flex-wrap">
                          {task.isHighPaying && (
                            <Badge variant="secondary">High Paying</Badge>
                          )}
                          {task.isInstant && (
                            <Badge variant="outline">Instant</Badge>
                          )}
                        </div>
                        <Separator />
                        <div className="flex justify-end space-x-2">
                           <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/edit-task/${task.id}`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the task and all associated user submissions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
              ))}
            </div>
             {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task Name</TableHead>
                    <TableHead>User Payout</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>₹{task.reward}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.isHighPaying && (
                            <Badge variant="secondary">High Paying</Badge>
                          )}
                          {task.isInstant && (
                            <Badge variant="outline">Instant</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/edit-task/${task.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Task</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete Task</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the task and all associated user submissions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <UserData users={users} transactions={transactions} onUpdate={fetchData} />
      </div>
    </div>
  );
}

    