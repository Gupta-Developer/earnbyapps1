
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ShieldAlert, Pencil, Trash2, DollarSign, Users, ListChecks } from "lucide-react";
import { Transaction, Task, User, TaskStatus } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
import UserData from "@/components/admin/user-data";


export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const { toast } = useToast();
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    setUsers(JSON.parse(JSON.stringify(MOCK_USERS)));
    const tasksRecord = MOCK_TASKS.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as Record<string, Task>);
    setTasks(JSON.parse(JSON.stringify(tasksRecord)));
    setTransactions(JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleDeleteTask = (taskId: string) => {
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        MOCK_TASKS.splice(taskIndex, 1);
    }
    
    let i = MOCK_TRANSACTIONS.length;
    while(i--) {
        if(MOCK_TRANSACTIONS[i].taskId === taskId) {
            MOCK_TRANSACTIONS.splice(i, 1);
        }
    }

    fetchData(); 

    toast({
      title: "Task Deleted",
      description: "The task and its submissions have been removed.",
    });
  };
  
  const handleUpdateTransactionStatus = (transactionId: string, status: TaskStatus) => {
    const transactionIndex = MOCK_TRANSACTIONS.findIndex(t => t.id === transactionId);
    if (transactionIndex > -1) {
        MOCK_TRANSACTIONS[transactionIndex].status = status;
    }
    
    setTransactions(prev =>
      prev.map(t => (t.id === transactionId ? { ...t, status } : t))
    );
    
     toast({
      title: "Status Updated",
      description: `Transaction status has been changed to ${status}.`,
    });
  };
  
  const totalPlatformProfit = useMemo(() => {
    return MOCK_TRANSACTIONS
      .filter(t => t.status === 'Paid')
      .reduce((sum, transaction) => {
        const task = MOCK_TASKS.find(t => t.id === transaction.taskId);
        if (task && task.totalReward) {
            const profit = task.totalReward - task.reward;
            return sum + profit;
        }
        return sum;
    }, 0);
  }, [transactions]); 

  const totalUserPayout = useMemo(() => {
    return MOCK_TRANSACTIONS
      .filter(t => t.status === 'Paid')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);
  
  const totalTasks = useMemo(() => MOCK_TASKS.length, [tasks]);
  const totalUsers = useMemo(() => Object.keys(MOCK_USERS).length, [users]);


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
    <div className="container mx-auto px-4 w-full max-w-7xl py-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage tasks, users, and submissions.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/add-task">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="space-y-6">
          <Card className="shadow-lg rounded-lg">
              <CardHeader>
              <CardTitle>Manage Tasks</CardTitle>
              <CardDescription>
                  {totalTasks} tasks available. View, edit, or delete them below.
              </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
              <div className="overflow-x-auto">
                  <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>User Payout</TableHead>
                      <TableHead>Total Reward</TableHead>
                      <TableHead>Platform Profit</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {Object.values(tasks).map((task) => (
                      <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.name}</TableCell>
                          <TableCell>₹{task.reward}</TableCell>
                          <TableCell>₹{task.totalReward || "N/A"}</TableCell>
                          <TableCell>₹{(task.totalReward || 0) - task.reward}</TableCell>
                          <TableCell className="flex items-center gap-2">
                          {task.isHighPaying && (
                              <Badge variant="secondary">High Paying</Badge>
                          )}
                          {task.isInstant && (
                              <Badge variant="outline">Instant</Badge>
                          )}
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
                                  <AlertDialogTitle>
                                  Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the task and all associated
                                  user submissions.
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

          <UserData
              users={users}
              transactions={transactions}
              onStatusChange={handleUpdateTransactionStatus}
          />
      </div>
    </div>
  );
}
    

    

    