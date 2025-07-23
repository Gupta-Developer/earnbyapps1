
import { Task } from './types';

export const tasks: Task[] = [
  {
    id: 1,
    name: 'Gullak',
    reward: 50,
    icon: 'https://placehold.co/100x100.png',
    hint: 'gold coins',
    description: 'Grow your savings effortlessly with Gullak. Automate your investments in digital gold and watch your wealth increase. A smart and simple way to secure your future.',
    steps: [
        "Click the button and download the app.",
        "Register on the Gullak app with your mobile number.",
        "Complete a digital gold investment of at least ₹50.",
        "Your wallet will be credited within 24 hours of verification."
    ],
    isInstant: false
  },
  {
    id: 2,
    name: 'PlayerzPot',
    reward: 120,
    icon: 'https://placehold.co/100x100.png',
    hint: 'cricket player',
    description: 'Experience the thrill of fantasy sports with PlayerzPot. Create your dream team, join contests, and win big. Your skills can earn you real cash prizes!',
    steps: [
        "Download the PlayerzPot app using the provided link.",
        "Complete the registration process.",
        "Make a minimum deposit of ₹100 into your account.",
        "Reward will be credited after your deposit is confirmed."
    ],
    isInstant: false
  },
  {
    id: 3,
    name: 'Upstox',
    reward: 200,
    icon: 'https://placehold.co/100x100.png',
    hint: 'stock chart',
    description: 'Start your trading journey with Upstox. A powerful platform for stocks, mutual funds, and IPOs. Enjoy a seamless trading experience with advanced tools.',
    steps: [
        "Click the link to download and register on Upstox.",
        "Complete the KYC (Know Your Customer) process.",
        "Activate your trading account.",
        "The reward will be credited to your wallet upon successful account activation."
    ],
    isInstant: false
  },
   {
    id: 4,
    name: 'Zupee',
    reward: 25,
    icon: 'https://placehold.co/100x100.png',
    hint: 'game controller',
    description: 'Play fun games and win real money with Zupee. Choose from a variety of skill-based games like Ludo and Carrom. Turn your gaming time into earning time!',
    steps: [
        "Download and install the Zupee app.",
        "Register and complete your profile.",
        "Make a minimum deposit of ₹10.",
        "Your reward will be instantly credited to your wallet."
    ],
    isInstant: true
  },
   {
    id: 5,
    name: 'Ludo Supreme',
    reward: 15,
    icon: 'https://placehold.co/100x100.png',
    hint: 'ludo board',
    description: 'The classic board game, now online! Play Ludo Supreme with friends and players from around the country. Win matches and earn exciting rewards.',
    steps: [
        "Download Ludo Supreme from the link.",
        "Sign up and play at least one cash game.",
        "Your reward will be credited instantly after your first game.",
    ],
    isInstant: true
  },
];
