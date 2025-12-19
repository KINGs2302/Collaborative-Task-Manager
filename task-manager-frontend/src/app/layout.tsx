import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { Toaster } from '@/components/ui/sonner';
import GlobalSnowfall from '@/components/layout/GlobalSnowfall';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager - Collaborate and Organize',
  description: 'A collaborative task management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white overflow-x-hidden`}>
       
        <GlobalSnowfall />

        
        <div className="relative z-10 min-h-screen bg-white">
          <AuthProvider>
            <SocketProvider>
              {children}
              <Toaster />
            </SocketProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
