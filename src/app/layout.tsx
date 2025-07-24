
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import Footer from '@/components/footer';
import ActivityTicker from '@/components/activity-ticker';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'EarnByApps',
  description: 'Earn rewards by completing tasks.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
             <div className="flex justify-center bg-background">
                <div className="w-full max-w-[480px] min-h-screen bg-card shadow-lg relative flex flex-col">
                  <Header />
                  <ActivityTicker />
                  <main className="flex-grow pt-24 pb-20">{children}</main>
                  <Footer />
                  <BottomNav />
                </div>
              </div>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
