
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
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";

interface UserDataProps {
    users: Record<string, User>;
}

export default function UserData({ users }: UserDataProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => {
        const userArray = Object.values(users);
        if (!searchQuery) {
            return userArray;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        
        return userArray.filter(user => {
            const nameMatch = user.fullName?.toLowerCase().includes(lowercasedQuery);
            const emailMatch = user.email?.toLowerCase().includes(lowercasedQuery);
            const phoneMatch = user.phone?.replace(/\D/g, '').includes(lowercasedQuery.replace(/\D/g, ''));
            
            return nameMatch || emailMatch || phoneMatch;
        });
    }, [searchQuery, users]);

    return (
        <Card className="shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle>User Data</CardTitle>
                <CardDescription>
                    View and search for registered users.
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
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>UPI ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                                        <TableCell>{user.email || 'N/A'}</TableCell>
                                        <TableCell>{user.phone || 'N/A'}</TableCell>
                                        <TableCell>{user.upiId || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No users found.
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
