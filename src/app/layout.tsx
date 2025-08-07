
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import BottomNav from '@/components/bottom-nav';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { IndianRupee, LayoutGrid, Shield, Home, Wallet2, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EarnByApps',
  description: 'Complete tasks and earn rewards! earn by trying new apps',
  manifest: '/manifest.json',
};

const AppLogo = () => (
    <Link href="/" className="flex items-center gap-2" aria-label="EarnByApps Home">
        <IndianRupee className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">EarnByApps</span>
    </Link>
);

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/offerwall", label: "Offerwall", icon: LayoutGrid },
  { href: "/wallet", label: "Wallet", icon: Wallet2 },
  { href: "/profile", label: "Profile", icon: User },
];


function Header() {
  return (
    <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between h-16 px-4 max-w-5xl mx-auto">
        <AppLogo />
        <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-4">
                 {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
          <AuthProvider>
            <AuthContent />
          </AuthProvider>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function AuthContent() {
    const { isAdmin } = useAuth();
    return (
        <>
        {isAdmin && (
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                <Shield className="h-5 w-5" />
                <span className="sr-only">Admin</span>
                </Link>
            </Button>
        )}
        </>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3F51B5" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
             <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow container mx-auto px-4 w-full max-w-5xl">
                    {children}
                </main>
                <Footer />
                <BottomNav />
              </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
