
"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { UserActivity, Transaction, User } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS } from "@/lib/mock-data";

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
    const fetchRecentActivities = () => {
        setLoading(true);
        const recentTransactions = MOCK_TRANSACTIONS.filter(t => t.status === 'Paid' || t.status === 'Approved').slice(0, 10);
        
        const generated = generateActivities(recentTransactions, MOCK_USERS);
        // Duplicate for marquee effect
        if (generated.length > 0) {
            setActivities([...generated, ...generated]);
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
