
"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { UserActivity } from "@/lib/types";
import { MOCK_TASKS, MOCK_TRANSACTIONS, MOCK_USERS } from "@/lib/mock-data";

export default function ActivityTicker() {
  const [activities, setActivities] = useState<UserActivity[]>([]);

  useEffect(() => {
    // Simulate fetching and combining data
    const generateActivities = () => {
      return MOCK_TRANSACTIONS.map(tx => {
        const user = MOCK_USERS[tx.userId];
        return {
          id: tx.id,
          userName: user?.fullName || 'Someone',
          taskName: tx.title,
          reward: tx.amount,
        };
      }).filter(Boolean) as UserActivity[];
    };

    const generated = generateActivities();
    // Duplicate the content to ensure a seamless loop for the marquee
    setActivities([...generated, ...generated]); 
  }, []);

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-10 bg-secondary/80 backdrop-blur-sm border-b overflow-hidden">
      <div className="relative flex whitespace-nowrap py-2">
        <div className="flex animate-marquee">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center mx-4 text-sm">
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
