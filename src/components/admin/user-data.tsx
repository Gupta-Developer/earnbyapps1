
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
import { User, Transaction, TaskStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from "date-fns";

interface UserDataProps {
    users: Record<string, User>;
    transactions: Transaction[];
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

export default function UserData({ users, transactions, onStatusChange }: UserDataProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const groupedAndFilteredUsers = useMemo(() => {
        const userMap = new Map<string, { user: User; transactions: Transaction[] }>();

        // Group transactions by user
        transactions.forEach(transaction => {
            const user = users[transaction.userId];
            if (user) {
                if (!userMap.has(user.id)) {
                    userMap.set(user.id, { user, transactions: [] });
                }
                userMap.get(user.id)!.transactions.push(transaction);
            }
        });
        
        Object.values(users).forEach(user => {
            if (!userMap.has(user.id)) {
                 userMap.set(user.id, { user, transactions: [] });
            }
        });

        if (!searchQuery) {
            return Array.from(userMap.values());
        }

        const lowercasedQuery = searchQuery.toLowerCase();

        return Array.from(userMap.values()).filter(({ user, transactions }) => {
            const nameMatch = user.fullName?.toLowerCase().includes(lowercasedQuery);
            const emailMatch = user.email?.toLowerCase().includes(lowercasedQuery);
            const phoneMatch = user.phone?.toLowerCase().includes(lowercasedQuery);
            const upiMatch = user.upiId?.toLowerCase().includes(lowercasedQuery);
            const taskMatch = transactions.some(t => t.title.toLowerCase().includes(lowercasedQuery));

            return nameMatch || emailMatch || phoneMatch || upiMatch || taskMatch;
        });

    }, [searchQuery, transactions, users]);

    return (
        <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle>User Data</CardTitle>
                <CardDescription>
                    View and manage user tasks and their statuses.
                </CardDescription>
                <div className="pt-2">
                    <Input 
                        placeholder="Search by user name, email, phone, UPI or task..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-md"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Accordion type="multiple" className="w-full">
                     {groupedAndFilteredUsers.length > 0 ? (
                        groupedAndFilteredUsers.map(({ user, transactions }) => (
                            <AccordionItem value={user.id} key={user.id} className="border-b">
                                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 text-left">
                                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                        <div className="truncate">
                                            <p className="font-semibold text-base text-foreground truncate">{user.fullName || 'N/A'}</p>
                                            <p className="text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                         <div className="truncate">
                                            <p className="font-semibold text-foreground truncate">{user.phone || 'No Phone'}</p>
                                            <p className="text-muted-foreground truncate">{user.upiId || 'No UPI ID'}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-4 shrink-0">{transactions.length} task(s)</Badge>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="bg-muted/30 p-4">
                                         <div className="overflow-x-auto">
                                            {transactions.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Task</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="text-right">Update Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {transactions.map(item => (
                                                            <TableRow key={item.id}>
                                                                <TableCell>
                                                                    <div className="font-medium">{item.title}</div>
                                                                    <div className="text-sm text-accent">₹{item.amount}</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {format(item.date, 'dd MMM, yyyy')}
                                                                </TableCell>
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
                                                                        <SelectTrigger className="w-[180px] ml-auto">
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
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="text-center text-muted-foreground p-4 text-sm">
                                                    This user has not initiated any tasks yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground p-8">
                            No users found for the current filter.
                        </div>
                    )}
                </Accordion>
            </CardContent>
        </Card>
    );
}
