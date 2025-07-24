
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { PlusCircle, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import { Transaction, TaskStatus, User, Task } from "@/lib/types";
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
import { Input } from "@/components/ui/input";

const getBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Paid":
      return "default";
    case "Approved":
      return "secondary";
    case "Under Verification":
      return "outline";
    case "Rejected":
      return "destructive";
    default:
      return "destructive";
  }
};

export default function AdminPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const { toast } = useToast();
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    // In a real app, you'd fetch this from an API.
    // For now, we use mock data.
    setUsers(MOCK_USERS);

    // Convert array to Record for easy lookup
    const tasksRecord = MOCK_TASKS.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as Record<string, Task>);
    setTasks(tasksRecord);

    setTransactions(MOCK_TRANSACTIONS);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

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
    // This is where you would normally send the updated statuses to your API.
    console.log("Saving changes for transactions:", transactions);

    toast({
      title: "Changes Saved (Simulated)",
      description: "All task statuses have been updated.",
      className: "bg-accent text-accent-foreground border-accent",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    // In a real app, this would be an API call.
    // For now, we'll just filter the state.
    const newTasks = { ...tasks };
    delete newTasks[taskId];
    setTasks(newTasks);

    const newTransactions = transactions.filter((t) => t.taskId !== taskId);
    setTransactions(newTransactions);

    toast({
      title: "Task Deleted",
      description: "The task and its submissions have been removed.",
    });
  };
  
  const getUserById = (id: string) => users[id];
  const getTaskById = (id: string) => tasks[id];
  
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
    <div className="p-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage tasks and user submissions.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/add-task">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </header>

      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Manage Tasks</CardTitle>
          <CardDescription>
            View, edit, or delete available tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(tasks).map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>₹{task.reward}</TableCell>
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
    </div>
  );
}

    
