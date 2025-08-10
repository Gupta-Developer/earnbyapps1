
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert } from "lucide-react";
import { Transaction, TaskStatus, User } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserData from "@/components/admin/user-data";

export default function UsersPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const { toast } = useToast();
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const fetchData = async () => {
    setUsers(JSON.parse(JSON.stringify(MOCK_USERS)));
    setTransactions(JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

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
       <UserData
          users={users}
          transactions={transactions}
          onStatusChange={handleUpdateTransactionStatus}
        />
    </div>
  );
}
