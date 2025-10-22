import { StackProvider } from '@stackframe/stack';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { stackClientApp } from '@/stack/client';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ReactNode } from 'react';
import { AppBarComponent } from '@/components/AppBarComponent';
import { StackThemeWrapper } from '@/components/StackThemeWrapper';
import { CustomThemeProvider } from '@/contexts/ThemeContext';

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
        <CustomThemeProvider>
          <StackProvider app={stackClientApp}>
            <StackThemeWrapper>
              <AppRouterCacheProvider>
                <AppBarComponent />
                {children}
              </AppRouterCacheProvider>
            </StackThemeWrapper>
          </StackProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
