
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { Transaction, Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import WhatsAppIcon from "@/components/whatsapp-icon";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc, Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";


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

const statusFaqs = [
    {
        status: "Paid",
        question: "What does 'Paid' mean?",
        answer: "The reward for this item has been successfully sent to the UPI ID registered in your profile. You can check your bank account to confirm the transaction."
    },
    {
        status: "Approved",
        question: "What does 'Approved' mean?",
        answer: "Congratulations! Your submission has been successfully verified. The reward amount has been approved and is now scheduled for payout in the next payment cycle."
    },
    {
        status: "Started & Ongoing",
        question: "What does 'Started & Ongoing' mean?",
        answer: "Your task submission or referral is being reviewed by our team. This process usually takes 24-48 hours."
    },
    {
        status: "Rejected",
        question: "What does 'Rejected' mean?",
        answer: "Unfortunately, your submission did not meet the required criteria. Please contact our support for more details if needed."
    }
]

type EnrichedTransaction = Transaction & { task?: Task };

export default function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
        if (!user) {
            setTransactions([]);
            setLoading(false);
            return;
        };
        
        setLoading(true);
        try {
            const transactionsRef = collection(db, "transactions");
            const q = query(transactionsRef, where("userId", "==", user.uid), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            
            const transactionsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data,
                    date: (data.date as Timestamp).toDate() // Convert Firestore Timestamp to JS Date
                } as Transaction;
            });
            
            const enriched = await Promise.all(transactionsList.map(async (tx) => {
                let task;
                if (tx.taskId) {
                    const taskDoc = await getDoc(doc(db, 'tasks', tx.taskId));
                    if (taskDoc.exists()) {
                        task = { id: taskDoc.id, ...taskDoc.data() } as Task;
                    }
                }
                return { ...tx, task };
            }));

            setTransactions(enriched);

        } catch (error) {
            console.error("Error fetching transactions: ", error);
        } finally {
            setLoading(false);
        }
    }

    fetchTransactions();
  }, [user]);

  const totalPaid = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingAmount = transactions
    .filter(t => t.status === 'Approved')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="py-4 space-y-6">
      <div className="pt-4 space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <Card className="text-center shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm">Total Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-accent">₹{totalPaid.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg rounded-lg">
              <CardHeader>
                <CardTitle className="text-muted-foreground text-sm">Pending Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-500">₹{pendingAmount.toFixed(2)}</p>
              </CardContent>
            </Card>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2 px-1">Earnings History</h2>
          <Card className="shadow-md rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                           Loading transactions...
                        </TableCell>
                    </TableRow>
                ) : transactions.length > 0 ? transactions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         {item.task && item.task.icon && (
                            <Image src={item.task.icon} alt={item.task.name} width={40} height={40} className="rounded-lg" />
                         )}
                         <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-accent">₹{item.amount}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(item.date), 'dd MMM, yyyy')}</div>
                         </div>
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-2 ml-1">ID: {item.id}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getBadgeClasses(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-y-2">
                      <Button
                          variant="link"
                          className="p-0 h-auto text-xs text-muted-foreground gap-1"
                          asChild
                        >
                          <a href={`https://wa.me/918319250462?text=Hi, I have a question about my transaction: ${item.id}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon className="h-4 w-4" />
                            Support
                          </a>
                        </Button>
                        {item.task && (
                           <Button
                            variant="link"
                            className="p-0 h-auto text-xs text-muted-foreground gap-1"
                            asChild
                            >
                            <Link href={`/tasks/${item.taskId}`}>
                                <ExternalLink className="h-4 w-4" />
                                View Task
                            </Link>
                            </Button>
                        )}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                      No transactions yet. Start a task to see it here!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
            <h2 className="text-lg font-semibold mb-2 px-1">Understanding Statuses</h2>
            <Accordion type="single" collapsible className="w-full space-y-2">
                {statusFaqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="bg-secondary/50 rounded-lg px-4 border-b-0">
                        <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-center gap-3">
                            <Badge className={getBadgeClasses(faq.status)}>
                                {faq.status}
                            </Badge>
                            <span>{faq.question}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pt-0 pb-4">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
      </div>
    </div>
  );
}
