
import { Task, Transaction, User, Faq } from "./types";

const MOCK_FAQS: Faq[] = [
      {
          question: "What if I don't complete all the steps?",
          answer: "You must complete all the steps exactly as listed to be eligible for the reward. Partial or incomplete submissions will not be rewarded."
      },
      {
          question: "How long does verification take?",
          answer: "Verification typically takes between 24 to 48 hours. Once our team confirms your completion, the status will update in your wallet and the reward will be credited."
      },
      {
          question: "Do I need to use the referral code?",
          answer: "Yes, using the special referral code is mandatory if provided. It's how we track your task completion and link it to your account for payment."
      },
      {
          question: "Can I do the same task twice?",
          answer: "No, each task is designed to be completed only once per user. This ensures fair opportunities for everyone in the community to earn."
      },
      {
          question: "What if I face an issue with the app?",
          answer: "If you encounter any technical problems with the partner app (e.g., download issues, crashes), please contact their support. For issues related to our platform or your payment, please contact our support team."
      }
  ]

export const MOCK_TASKS: Task[] = []; // This is now fetched from Firestore

export const MOCK_USERS: Record<string, User> = {
    'admin-user-id': {
        id: 'admin-user-id',
        fullName: 'Admin User',
        email: 'aashish.gupta.mails@gmail.com',
        phone: '123-456-7890',
        upiId: 'admin@upi'
    },
    'user-123': {
        id: 'user-123',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '987-654-3210',
        upiId: 'johndoe@upi',
    },
    'google-user-id': {
        id: 'google-user-id',
        fullName: 'Google User',
        email: 'google.user@example.com',
        phone: '111-222-3333',
        upiId: 'google@upi',
    }
}

export const MOCK_TRANSACTIONS: Transaction[] = []; // This is now fetched from Firestore
