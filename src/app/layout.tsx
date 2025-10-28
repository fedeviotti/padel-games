import { StackProvider } from '@stackframe/stack';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { stackClientApp } from '@/stack/client';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          margin: 0,
          padding: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CustomThemeProvider>
          <StackProvider app={stackClientApp}>
            <StackThemeWrapper>
              <AppRouterCacheProvider>
                <NextIntlClientProvider>{children}</NextIntlClientProvider>
              </AppRouterCacheProvider>
            </StackThemeWrapper>
          </StackProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
