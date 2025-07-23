
export type TaskStatus = "Under Verification" | "Approved" | "Rejected" | "Paid";

export type Task = {
  id: number;
  name: string;
  reward: number;
  icon: string;
  hint: string;
  description: string;
  steps: string[];
  isInstant: boolean;
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
  taskId: number;
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
