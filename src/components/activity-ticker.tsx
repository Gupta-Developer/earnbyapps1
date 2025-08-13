
"use client";

import { useMemo, useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { UserActivity, Transaction, User } from "@/lib/types";
import { collectionGroup, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const generateActivities = (transactions: Transaction[], users: Record<string, User>): UserActivity[] => {
  return transactions.map(tx => {
    const user = users[tx.userId];
    if (!user) return null;
    return {
      id: tx.id,
      userName: user.fullName || 'Someone',
      taskName: tx.title,
      reward: tx.amount,
    };
  }).filter(Boolean) as UserActivity[];
};


export default function ActivityTicker() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivities = async () => {
        setLoading(true);
        try {
            const transactionsQuery = query(
                collectionGroup(db, 'transactions'),
                where('status', 'in', ['Paid', 'Approved']),
                limit(10)
            );
            const transactionSnap = await getDocs(transactionsQuery);
            const recentTransactions = transactionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
            
            const userIds = [...new Set(recentTransactions.map(t => t.userId))];
            const users: Record<string, User> = {};

            // In a real app, you might fetch these users more efficiently
            for (const userId of userIds) {
                const userDoc = await db.collection('users').doc(userId).get();
                if(userDoc.exists) {
                    users[userId] = userDoc.data() as User;
                }
            }

            const generated = generateActivities(recentTransactions, users);
            // Duplicate for marquee effect
            if (generated.length > 0) {
                setActivities([...generated, ...generated]);
            }

        } catch (error) {
            console.error("Error fetching recent activities: ", error);
        }
        setLoading(false);
    };

    fetchRecentActivities();
  }, []);

  if (loading || activities.length === 0) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="w-full bg-secondary/80 backdrop-blur-sm border-b overflow-hidden">
        <div className="relative flex whitespace-nowrap py-2">
             <div className="flex animate-marquee">
                {activities.map((activity, index) => (
                    <div key={`${activity.id}-${index}`} className="flex items-center mx-4 text-sm shrink-0">
                        <Zap className="w-4 h-4 text-accent mr-2" />
                        <span className="font-semibold text-foreground">{activity.userName}</span>
                        <span className="text-muted-foreground mx-1">earned</span>
                        <span className="font-semibold text-accent">₹{activity.reward}</span>
                        <span className="text-muted-foreground mx-1">from</span>
                        <span className="font-semibold text-foreground">{activity.taskName}</span>
                    </div>
                ))}
            </div>
             <div className="flex animate-marquee" aria-hidden="true">
                {activities.map((activity, index) => (
                    <div key={`${activity.id}-${index}-clone`} className="flex items-center mx-4 text-sm shrink-0">
                        <Zap className="w-4 h-4 text-accent mr-2" />
                        <span className="font-semibold text-foreground">{activity.userName}</span>
                        <span className="text-muted-foreground mx-1">earned</span>
                        <span className="font-semibold text-accent">₹{activity.reward}</span>
                        <span className="text-muted-foreground mx-1">from</span>
                        <span className="font-semibold text-foreground">{activity.taskName}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
