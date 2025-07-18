"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";

type TaskStatus = "Pending" | "Approved" | "Rejected" | "Paid";

type UserTask = {
  id: number;
  userName: string;
  phone: string;
  upiId: string;
  taskName: string;
  status: TaskStatus;
};

const initialUserTasks: UserTask[] = [
  { id: 1, userName: 'John Doe', phone: '9876543210', upiId: 'john@bank', taskName: 'GrowMeOrganic', status: 'Approved' },
  { id: 2, userName: 'Jane Smith', phone: '8765432109', upiId: 'jane@upi', taskName: 'AppCreator', status: 'Paid' },
  { id: 3, userName: 'Peter Jones', phone: '7654321098', upiId: 'peter@bank', taskName: 'TaskRunner', status: 'Pending' },
  { id: 4, userName: 'Mary Jane', phone: '6543210987', upiId: 'mary@upi', taskName: 'DataMiner', status: 'Rejected' },
];

// In a real app, this would be based on user authentication and roles.
const isAdmin = true;

export default function AdminPage() {
  const [tasks, setTasks] = useState<UserTask[]>(initialUserTasks);
  const { toast } = useToast();

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleSaveChanges = () => {
    // Here you would typically send the updated data to your backend.
    toast({
      title: "Changes Saved",
      description: "All task statuses have been updated.",
      className: "bg-accent text-accent-foreground border-accent"
    });
  };

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
                                    <TableHead className="w-[150px]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tasks.map((task) => (
                                    <TableRow key={task.id}>
                                        <TableCell className="font-medium">{task.userName}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">{task.phone}</div>
                                            <div className="text-xs text-muted-foreground">{task.upiId}</div>
                                        </TableCell>
                                        <TableCell>{task.taskName}</TableCell>
                                        <TableCell>
                                        <Select
                                            value={task.status}
                                            onValueChange={(value: TaskStatus) => handleStatusChange(task.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Set status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Approved">Approved</SelectItem>
                                                <SelectItem value="Rejected">Rejected</SelectItem>
                                                <SelectItem value="Paid">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
