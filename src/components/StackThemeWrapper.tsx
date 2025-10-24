'use client';

import { StackTheme } from '@stackframe/stack';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface StackThemeWrapperProps {
  children: ReactNode;
}

export function StackThemeWrapper({ children }: StackThemeWrapperProps) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <StackTheme>{children}</StackTheme>
    </ThemeProvider>
  );
}
