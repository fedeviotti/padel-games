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
  // Configure StackTheme to match Material-UI theme
  // TODO: crea variabili per i colori in un file di configurazione
  // (capire se possibile usare i colori del tema di material ui)
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
