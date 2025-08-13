
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

export const MOCK_TASKS: Task[] = [
    {
        id: 'task-1',
        name: "PlayerzPot",
        reward: 120,
        totalReward: 150,
        icon: "https://placehold.co/100x100.png",
        hint: "cricket player",
        banner: "https://placehold.co/600x400.png",
        description: "Download the PlayerzPot app, register, and make your first deposit to earn a huge reward. Enjoy fantasy sports and win big!",
        steps: "1. Click the link and download the app.\n2. Register with your mobile number.\n3. Make a minimum deposit of ₹50.\n4. Reward will be credited within 24 hours.",
        link: "#",
        isInstant: false,
        isHighPaying: true,
        youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        faqs: MOCK_FAQS,
    },
    {
        id: 'task-2',
        name: "Upstox",
        reward: 150,
        totalReward: 200,
        icon: "https://placehold.co/100x100.png",
        hint: "graph stock",
        banner: "https://placehold.co/600x400.png",
        description: "Open a new Upstox account and complete your KYC to get a massive reward. Start your trading journey today!",
        steps: "1. Download the app and sign up.\n2. Complete your KYC verification.\n3. Your account must be successfully activated.\n4. Reward will be processed after verification.",
        link: "#",
        isInstant: false,
        isHighPaying: true,
        faqs: MOCK_FAQS,
    },
     {
        id: 'task-3',
        name: "Ludo Supreme",
        reward: 10,
        totalReward: 15,
        icon: "https://placehold.co/100x100.png",
        hint: "ludo board",
        description: "Play your favorite board game and earn real money. Just download, register, and play one game to claim your reward.",
        steps: "1. Download the Ludo Supreme app.\n2. Register an account.\n3. Play at least one cash game.",
        link: "#",
        isInstant: true,
        isHighPaying: false
    },
];

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

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'trans-1',
        userId: 'user-123',
        taskId: 'task-1',
        title: 'PlayerzPot Task',
        amount: 120,
        status: 'Paid',
        date: new Date('2023-10-26'),
    },
    {
        id: 'trans-2',
        userId: 'user-123',
        taskId: 'task-2',
        title: 'Upstox Task',
        amount: 150,
        status: 'Approved',
        date: new Date('2023-10-27'),
    },
    {
        id: 'trans-3',
        userId: 'google-user-id',
        taskId: 'task-3',
        title: 'Ludo Supreme Task',
        amount: 10,
        status: 'Started & Ongoing',
        date: new Date('2023-10-28'),
    }
];
