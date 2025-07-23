import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { PT_Sans } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import Footer from '@/components/footer';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'EarnByApps',
  description: 'Earn rewards by completing tasks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ptSans.variable} font-body antialiased`}>
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
                  <main className="flex-grow pt-16 pb-20">{children}</main>
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
