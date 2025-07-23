
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
    id: "task-1",
    name: "PlayerzPot",
    reward: 120,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "cricket player",
    description: "A leading fantasy sports app. Create your team and compete to win real cash prizes daily. Simple, fun, and engaging.",
    steps: "1. Download the app.\n2. Register an account using the code.\n3. Make your first deposit.",
    isInstant: true,
    isHighPaying: true,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-2",
    name: "Dream11",
    reward: 150,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "cricket stadium",
    description: "The original fantasy sports giant. Play fantasy cricket, football, and more to win big rewards.",
    steps: "1. Install the app from the link.\n2. Complete the registration process.\n3. Join a contest.",
    isInstant: false,
    isHighPaying: true,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-3",
    name: "Navi UPI",
    reward: 50,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "money transfer",
    description: "A simple and secure UPI app for all your payment needs. Get cashback on your first transaction.",
    steps: "1. Download and install Navi.\n2. Register with your bank account.\n3. Make a transaction of at least ₹1.",
    isInstant: true,
    isHighPaying: false,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
    {
    id: "task-4",
    name: "Groww",
    reward: 200,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "stock chart",
    description: "Invest in stocks, mutual funds, and gold with an easy-to-use platform. Start your investment journey.",
    steps: "1. Create an account on Groww.\n2. Complete the KYC verification.\n3. Add funds to your wallet.",
    isInstant: false,
    isHighPaying: true,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-5",
    name: "A23 Games",
    reward: 80,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "playing cards",
    description: "Play Rummy, Carrom, and other exciting games on A23. Win real cash with your skills.",
    steps: "1. Download A23 Games app.\n2. Sign up and verify your number.\n3. Play your first cash game.",
    isInstant: true,
    isHighPaying: false,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-6",
    name: "Upstox",
    reward: 250,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "trading graph",
    description: "A powerful platform for stock trading and mutual fund investments. Open a free Demat account.",
    steps: "1. Install the Upstox app.\n2. Complete the e-KYC process with your PAN and Aadhaar.\n3. Activate your account.",
    isInstant: false,
    isHighPaying: true,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-7",
    name: "Paytm First Games",
    reward: 60,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "game controller",
    description: "A universe of gaming, from fantasy sports to casual games. Earn Paytm cash rewards.",
    steps: "1. Download the app.\n2. Register with your Paytm number.\n3. Participate in any paid contest.",
    isInstant: true,
    isHighPaying: false,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
  },
  {
    id: "task-8",
    name: "PhonePe",
    reward: 75,
    icon: "https://placehold.co/100x100.png",
    image: "https://placehold.co/600x400.png",
    hint: "mobile payment",
    description: "India's leading digital payment app. Send money, pay bills, and recharge with ease.",
    steps: "1. Install the PhonePe app.\n2. Link your bank account via UPI.\n3. Make 3 transactions to three different users.",
    isInstant: true,
    isHighPaying: false,
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    faqs: MOCK_FAQS,
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
        upiId: 'johndoe@upi'
    }
}

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'txn-1',
        userId: 'admin-user-id',
        taskId: 'task-1',
        app: 'PlayerzPot',
        amount: 120,
        status: 'Paid',
        date: new Date('2023-10-26T10:00:00Z'),
    },
    {
        id: 'txn-2',
        userId: 'admin-user-id',
        taskId: 'task-2',
        app: 'Dream11',
        amount: 150,
        status: 'Approved',
        date: new Date('2023-10-25T11:30:00Z'),
    },
    {
        id: 'txn-3',
        userId: 'user-123',
        taskId: 'task-3',
        app: 'Navi UPI',
        amount: 50,
        status: 'Under Verification',
        date: new Date('2023-10-24T15:00:00Z'),
    },
    {
        id: 'txn-4',
        userId: 'user-123',
        taskId: 'task-4',
        app: 'Groww',
        amount: 200,
        status: 'Rejected',
        date: new Date('2023-10-23T09:00:00Z'),
    },
    {
        id: 'txn-5',
        userId: 'admin-user-id',
        taskId: 'task-5',
        app: 'A23 Games',
        amount: 80,
        status: 'Under Verification',
        date: new Date('2023-10-27T12:00:00Z'),
    },
    {
        id: 'txn-6',
        userId: 'user-123',
        taskId: 'task-6',
        app: 'Upstox',
        amount: 250,
        status: 'Paid',
        date: new Date('2023-10-28T14:45:00Z'),
    },
    {
        id: 'txn-7',
        userId: 'admin-user-id',
        taskId: 'task-7',
        app: 'Paytm First Games',
        amount: 60,
        status: 'Approved',
        date: new Date('2023-10-29T16:20:00Z'),
    },
    {
        id: 'txn-8',
        userId: 'user-123',
        taskId: 'task-8',
        app: 'PhonePe',
        amount: 75,
        status: 'Under Verification',
        date: new Date('2023-10-30T18:00:00Z'),
    }
]
