'use client';

import { StackTheme } from '@stackframe/stack';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface StackThemeWrapperProps {
  children: ReactNode;
}

export function StackThemeWrapper({ children }: StackThemeWrapperProps) {
  // Configure StackTheme to match Material-UI theme
  const stackTheme = {
    light: {
      muted: '#90caf9',
      popoverForeground: '#3a3a40',
    },
    dark: {
      muted: '#52affa', // Material-UI primary blue
      popoverForeground: '#fafafa',
    },
  };

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <StackTheme theme={stackTheme}>{children}</StackTheme>
    </ThemeProvider>
  );
}
