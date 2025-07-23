
"use client";

import { useEffect, useState, useMemo } from "react";
import { Zap } from "lucide-react";
import { UserActivity } from "@/lib/types";
import { MOCK_TRANSACTIONS, MOCK_USERS } from "@/lib/mock-data";
import { AnimatePresence, motion } from "framer-motion";

const generateActivities = (): UserActivity[] => {
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

export default function ActivityTicker() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setActivities(generateActivities());
  }, []);

  useEffect(() => {
    if (activities.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, 4000); // Show each activity for 4 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, activities.length]);

  if (activities.length === 0) {
    return null;
  }

  const currentActivity = activities[currentIndex];

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-10 bg-secondary/80 backdrop-blur-sm border-b overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="relative flex whitespace-nowrap py-2 justify-center"
        >
          <div className="flex items-center mx-4 text-sm">
            <Zap className="w-4 h-4 text-accent mr-2" />
            <span className="font-semibold text-foreground">{currentActivity.userName}</span>
            <span className="text-muted-foreground mx-1">earned</span>
            <span className="font-semibold text-accent">₹{currentActivity.reward}</span>
            <span className="text-muted-foreground mx-1">from</span>
            <span className="font-semibold text-foreground">{currentActivity.taskName}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
