import { StackProvider, StackTheme } from '@stackframe/stack';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { stackClientApp } from '@/stack/client';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';
import { AppBarComponent } from '@/components/AppBarComponent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Padel Games',
  description: 'Manage your padel games, tournaments, and player statistics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <AppRouterCacheProvider>
              <CssBaseline />
              <AppBarComponent />
              {children}
            </AppRouterCacheProvider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
