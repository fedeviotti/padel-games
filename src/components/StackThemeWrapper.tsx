'use client';

import { colors } from '@mui/material';
import { StackTheme } from '@stackframe/stack';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { padelGamesColors } from '@/constants/colors';

interface StackThemeWrapperProps {
  children: ReactNode;
}

export function StackThemeWrapper({ children }: StackThemeWrapperProps) {
  const stackTheme = {
    light: {
      muted: padelGamesColors.light.muted,
      popoverForeground: padelGamesColors.light.popoverForeground,
    },
    dark: {
      muted: colors.grey[500],
      popoverForeground: padelGamesColors.dark.popoverForeground,
    },
  };

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <StackTheme theme={stackTheme}>{children}</StackTheme>
    </ThemeProvider>
  );
}
