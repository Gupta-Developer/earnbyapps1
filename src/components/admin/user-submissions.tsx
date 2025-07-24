
"use client";

import { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Transaction, User, TaskStatus } from "@/lib/types";
import { format } from "date-fns";

interface UserSubmissionsProps {
  transactions: Transaction[];
  users: Record<string, User>;
  onStatusChange: (transactionId: string, status: TaskStatus) => void;
}

const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'Paid':
            return 'default'; // Uses accent color via custom css
        case 'Approved':
            return 'secondary';
        case 'Under Verification':
            return 'outline';
        case 'Rejected':
            return 'destructive';
        default:
            return 'destructive';
    }
}


export default function UserSubmissions({ transactions, users, onStatusChange }: UserSubmissionsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) {
      return transactions;
    }
    const lowercasedQuery = searchQuery.toLowerCase();

    return transactions.filter(transaction => {
      const user = users[transaction.userId];
      const nameMatch = user?.fullName?.toLowerCase().includes(lowercasedQuery);
      const emailMatch = user?.email?.toLowerCase().includes(lowercasedQuery);
      const taskMatch = transaction.title.toLowerCase().includes(lowercasedQuery);

      return nameMatch || emailMatch || taskMatch;
    });
  }, [searchQuery, transactions, users]);

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle>User Submissions</CardTitle>
        <CardDescription>
          Review and update the status of user task submissions.
        </CardDescription>
        <div className="pt-2">
          <Input
            placeholder="Search by name, email, or task..."
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
                <TableHead>User</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{users[item.userId]?.fullName || 'Unknown User'}</div>
                      <div className="text-sm text-muted-foreground">{users[item.userId]?.email}</div>
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{format(item.date, "dd MMM, yyyy")}</TableCell>
                    <TableCell>₹{item.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(item.status)} className={item.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Select
                          value={item.status}
                          onValueChange={(value) => onStatusChange(item.id!, value as TaskStatus)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Under Verification">Under Verification</SelectItem>
                              <SelectItem value="Approved">Approved</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
