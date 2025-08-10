
"use client";

import { useMemo } from "react";
import { Zap } from "lucide-react";
import { UserActivity } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS } from "@/lib/mock-data";

const generateActivities = (): UserActivity[] => {
  return MOCK_TRANSACTIONS.map(tx => {
    const user = MOCK_USERS[tx.userId];
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
  const activities = useMemo(() => {
    const baseActivities = generateActivities();
    // We duplicate the activities to create a seamless looping effect for the marquee.
    if (baseActivities.length > 0) {
        return [...baseActivities, ...baseActivities];
    }
    return [];
  }, []);

  if (activities.length === 0) {
    return null;
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
             <div className="flex animate-marquee">
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
