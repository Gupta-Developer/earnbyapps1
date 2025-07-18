import { Task, Transaction, User, UserTask, TaskStatus } from './types';

export const users: User[] = [
    { id: 1, fullName: 'John Doe', phone: '9876543210', upiId: 'john@bank' },
    { id: 2, fullName: 'Jane Smith', phone: '8765432109', upiId: 'jane@upi' },
];

export const tasks: Task[] = [
  { 
    id: 1, 
    name: "GrowMeOrganic", 
    reward: 20, 
    icon: "https://placehold.co/80x80.png", 
    hint: "growth chart",
    description: "Help test a new app for organic gardening enthusiasts.",
    steps: [
        "Download the GrowMeOrganic app from the link provided.",
        "Create an account using your email.",
        "Use the plant identification feature on 3 different plants.",
        "Submit feedback through the in-app form.",
    ],
    isInstant: false,
  },
  { 
    id: 2, 
    name: "AppCreator", 
    reward: 50, 
    icon: "https://placehold.co/80x80.png", 
    hint: "mobile app",
    description: "Test the beta version of our no-code app builder.",
    steps: [
        "Sign up for a beta account on the AppCreator website.",
        "Build a simple one-page app using the drag-and-drop editor.",
        "Publish your test app.",
        "Complete the user experience survey.",
    ],
    isInstant: false,
  },
  { 
    id: 3, 
    name: "TaskRunner", 
    reward: 15, 
    icon: "https://placehold.co/80x80.png", 
    hint: "running shoe",
    description: "Get paid to complete simple local errands and tasks.",
     steps: [
        "Install the TaskRunner application.",
        "Complete your profile and identity verification.",
        "Accept and complete one 'demo' task in the app.",
        "Confirm task completion to receive your reward.",
    ],
    isInstant: true,
  },
  { 
    id: 4, 
    name: "DataMiner", 
    reward: 100, 
    icon: "https://placehold.co/80x80.png", 
    hint: "data analysis",
    description: "Help us improve our data analysis algorithms.",
    steps: [
        "Download and install the DataMiner software.",
        "Run the software on a dataset of your choice (min 1000 rows).",
        "Export the analysis report.",
        "Upload the report to the specified cloud drive.",
    ],
    isInstant: false,
  },
  { 
    id: 5, 
    name: "SocialBoost", 
    reward: 25, 
    icon: "https://placehold.co/80x80.png", 
    hint: "social media",
    description: "Boost your social media presence with our new tool.",
    steps: [
        "Connect your primary social media account.",
        "Schedule 5 posts using the SocialBoost scheduler.",
        "Let the posts be published automatically.",
        "Take a screenshot of your scheduled posts queue.",
    ],
    isInstant: true,
  },
];


export const transactions: Transaction[] = [
  { id: 1, userId: 1, taskId: 2, app: 'AppCreator', amount: 50, status: 'Paid', date: new Date(2023, 10, 14) },
  { id: 2, userId: 2, taskId: 5, app: 'SocialBoost', amount: 25, status: 'Paid', date: new Date(2023, 9, 28) },
  { id: 3, userId: 1, taskId: 1, app: 'GrowMeOrganic', amount: 20, status: 'Approved', date: new Date(2023, 10, 15) },
  { id: 4, userId: 2, taskId: 3, app: 'TaskRunner', amount: 15, status: 'Rejected', date: new Date(2023, 10, 18) },
];
