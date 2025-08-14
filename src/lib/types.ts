
import { FieldValue } from "firebase/firestore";

export type TaskStatus = "Started & Ongoing" | "Approved" | "Rejected" | "Paid";

export type Faq = {
  question: string;
  answer: string;
};

export type Task = {
  id: string; // Document ID from Firestore
  name: string;
  reward: number; // Payout to the user
  totalReward?: number; // Total amount from the advertiser
  icon: string;
  hint: string;
  banner?: string;
  description: string;
  steps: string; // Storing as a single string, separated by newlines
  link: string;
  isInstant: boolean;
  isHighPaying: boolean;
  youtubeLink?: string;
  faqs?: Faq[];
  createdAt?: FieldValue;
};

export type User = {
    id: string; // Should be UID from Firebase
    fullName?: string;
    email?: string;
    phone?: string;
    upiId?: string;
};

export type Transaction = {
  id?: string; // Document ID from Firestore
  userId: string;
  taskId: string;
  title: string; // e.g., "PlayerzPot Task" or "Referral Bonus"
  amount: number;
  status: TaskStatus;
  date: Date | FieldValue;
};

// This can be used for a joined view if needed
export type UserTask = {
  transactionId: number;
  user: User;
  task: Task;
  status: TaskStatus;
  date: Date;
};

export type UserActivity = {
    id?: string;
    userName: string;
    taskName: string;
    reward: number;
}
