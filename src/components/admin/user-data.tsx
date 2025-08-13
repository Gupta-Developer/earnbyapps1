
"use client";

import { useState, useMemo, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "@/components/ui/separator";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


const getBadgeClasses = (status: string): string => {
    switch (status) {
        case 'Paid':
            return 'bg-accent text-accent-foreground border-transparent';
        case 'Approved':
            return 'bg-blue-500 text-white border-transparent';
        case 'Started & Ongoing':
            return 'bg-yellow-500 text-white border-transparent';
        case 'Rejected':
            return 'bg-destructive text-destructive-foreground border-transparent';
        default:
            return 'bg-gray-500 text-white border-transparent';
    }
}

type UserDataProps = {
    users: Record<string, User>;
    onUpdate: () => void;
}

export default function UserData({ users, onUpdate }: UserDataProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const { toast } = useToast();
    const { isAdmin } = useAuth();
    
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!isAdmin || !users) return;

            const allTransactions: Transaction[] = [];
            for (const userId in users) {
                 const transactionsRef = collection(db, "users", userId, "transactions");
                 const transactionsSnapshot = await getDocs(transactionsRef);
                 transactionsSnapshot.forEach(transDoc => {
                     allTransactions.push({ id: transDoc.id, userId, ...transDoc.data() } as Transaction);
                 })
            }
            setTransactions(allTransactions);
        };

        fetchTransactions();
    }, [isAdmin, users]);
    
    const handleUpdateTransactionStatus = async (userId: string, transactionId: string, status: TaskStatus) => {
        if (!userId || !transactionId) return;
        
        try {
            const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
            await updateDoc(transactionRef, { status });
            
            toast({
                title: "Status Updated",
                description: `Transaction status has been changed to ${status}.`,
            });
            onUpdate(); // Trigger data refresh in parent component
        } catch (error) {
            console.error("Error updating status: ", error);
            toast({ title: "Error", description: "Could not update status.", variant: "destructive" });
        }
    };

    const groupedAndFilteredUsers = useMemo(() => {
        const userMap = new Map<string, { user: User; transactions: Transaction[] }>();

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

        let filteredUsers = Array.from(userMap.values());

        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filteredUsers = filteredUsers.filter(({ user, transactions }) => {
                const nameMatch = user.fullName?.toLowerCase().includes(lowercasedQuery);
                const emailMatch = user.email?.toLowerCase().includes(lowercasedQuery);
                const phoneMatch = user.phone?.toLowerCase().includes(lowercasedQuery);
                const upiMatch = user.upiId?.toLowerCase().includes(lowercasedQuery);
                const taskMatch = transactions.some(t => t.title.toLowerCase().includes(lowercasedQuery));

                return nameMatch || emailMatch || phoneMatch || upiMatch || taskMatch;
            });
        }
        
        return filteredUsers;

    }, [searchQuery, transactions, users]);
    
    const totalUsers = Object.keys(users).length;

    return (
        <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle>User Data</CardTitle>
                <CardDescription>
                    {totalUsers} users registered. View and manage user tasks and their statuses.
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
                                <AccordionTrigger className="px-4 md:px-6 py-4 hover:bg-muted/50 text-left hover:no-underline">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base text-foreground truncate">{user.fullName || 'N/A'}</p>
                                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <div className="hidden md:block flex-1 min-w-0 text-right">
                                             <p className="font-semibold text-foreground truncate">{user.phone || 'No Phone'}</p>
                                             <p className="text-sm text-muted-foreground truncate">{user.upiId || 'No UPI ID'}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="ml-4 shrink-0">{transactions.length} task(s)</Badge>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="bg-muted/30 p-4">
                                        <div className="md:hidden space-y-1 text-sm mb-4">
                                            <p><span className="font-semibold">Phone:</span> {user.phone || 'N/A'}</p>
                                            <p><span className="font-semibold">UPI ID:</span> {user.upiId || 'N/A'}</p>
                                        </div>
                                        {/* Mobile View: Card List */}
                                        <div className="md:hidden space-y-4">
                                             {transactions.length > 0 ? (
                                                transactions.map(item => (
                                                    <Card key={item.id} className="w-full">
                                                        <CardContent className="p-4 space-y-3">
                                                            <div>
                                                                <p className="font-semibold">{item.title}</p>
                                                                <p className="text-sm text-accent">₹{item.amount}</p>
                                                                <p className="text-xs text-muted-foreground">{format(item.date, 'dd MMM, yyyy')}</p>
                                                            </div>
                                                            <Separator />
                                                             <div className="flex items-center justify-between gap-2">
                                                                <Badge className={getBadgeClasses(item.status)}>
                                                                    {item.status}
                                                                </Badge>
                                                                <Select
                                                                    value={item.status}
                                                                    onValueChange={(value) => handleUpdateTransactionStatus(user.id, item.id!, value as TaskStatus)}
                                                                    >
                                                                    <SelectTrigger className="w-[160px] h-9 text-xs">
                                                                        <SelectValue placeholder="Update" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Started & Ongoing">Started & Ongoing</SelectItem>
                                                                        <SelectItem value="Approved">Approved</SelectItem>
                                                                        <SelectItem value="Paid">Paid</SelectItem>
                                                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                             ) : (
                                                 <div className="text-center text-muted-foreground py-4 text-sm">
                                                    This user has not initiated any tasks yet.
                                                </div>
                                             )}
                                        </div>
                                         {/* Desktop View: Table */}
                                        <div className="hidden md:block overflow-x-auto">
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
                                                                    <Badge className={getBadgeClasses(item.status)}>
                                                                        {item.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Select
                                                                        value={item.status}
                                                                        onValueChange={(value) => handleUpdateTransactionStatus(user.id, item.id!, value as TaskStatus)}
                                                                        >
                                                                        <SelectTrigger className="w-[180px] ml-auto">
                                                                            <SelectValue placeholder="Update Status" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Started & Ongoing">Started & Ongoing</SelectItem>
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
