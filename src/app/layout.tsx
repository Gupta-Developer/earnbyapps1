
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import Footer from '@/components/footer';

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
                  <div className="w-full max-w-2xl mx-auto">
                    {children}
                  </div>
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
