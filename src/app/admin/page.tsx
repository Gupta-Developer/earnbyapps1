
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, ShieldAlert, DollarSign, Users, ListChecks } from "lucide-react";
import { Transaction, Task, User } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS, MOCK_TASKS } from "@/lib/mock-data";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import ActiveUsersChart from "@/components/admin/active-users-chart";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    // We only need transactions for the stats cards on the dashboard
    setTransactions(JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)));
  }, []);

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
  
  const totalTasks = useMemo(() => MOCK_TASKS.length, []);
  const totalUsers = useMemo(() => Object.keys(MOCK_USERS).length, []);


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
    <div className="px-4 w-full py-4 space-y-6">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Overview of your platform's activity.
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

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
         <ActiveUsersChart />
      </div>
    </div>
  );
}
