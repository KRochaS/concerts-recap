import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Work_Sans, Satisfy } from 'next/font/google';
import { Header } from '@/presentation/shared/components/header/Header';
import { ToastContainer } from 'react-toastify';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const workSansDisplay = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const satisfyDisplay = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Concerts Recap',
  description: 'Log and organize your concert memories',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="app-background">
      <body
        className={`${workSansDisplay.className} ${satisfyDisplay.variable} antialiased text-content-body min-h-screen flex flex-col`}
      >
        <NuqsAdapter>
          <Header />
          {children}
          <ToastContainer position="top-right" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
