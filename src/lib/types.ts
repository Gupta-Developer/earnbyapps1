
export type TaskStatus = "Under Verification" | "Approved" | "Rejected" | "Paid";

export type Faq = {
  question: string;
  answer: string;
};

export type Task = {
  id: string; // Document ID from Firestore
  name: string;
  reward: number;
  icon: string;
  image?: string; // Optional banner image for the task detail page
  hint: string;
  description: string;
  steps: string; // Storing as a single string, separated by newlines
  isInstant: boolean;
  isHighPaying: boolean;
  youtubeLink?: string;
  faqs?: Faq[];
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
  app: string;
  amount: number;
  status: TaskStatus;
  date: Date;
};

// This can be used for a joined view if needed
export type UserTask = {
  transactionId: number;
  user: User;
  task: Task;
  status: TaskStatus;
  date: Date;
};
