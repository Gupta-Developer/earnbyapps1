
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
import { PlusCircle, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/lib/types";
import { MOCK_TASKS, MOCK_TRANSACTIONS } from "@/lib/mock-data";
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const { toast } = useToast();
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    const tasksRecord = MOCK_TASKS.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {} as Record<string, Task>);
    setTasks(JSON.parse(JSON.stringify(tasksRecord)));
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
  
  const totalTasks = useMemo(() => Object.keys(tasks).length, [tasks]);

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
    <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
                <CardTitle>Manage Tasks</CardTitle>
                <CardDescription>
                    {totalTasks} tasks available. View, edit, or delete them below.
                </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/admin/add-task">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
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
                  {Object.values(tasks).map((task) => (
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
    </div>
  );
}
