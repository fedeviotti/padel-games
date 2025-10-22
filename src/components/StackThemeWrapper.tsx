'use client';

import { StackTheme } from '@stackframe/stack';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface StackThemeWrapperProps {
  children: ReactNode;
}

export function StackThemeWrapper({ children }: StackThemeWrapperProps) {
  // Configure StackTheme to match Material-UI theme
  // TODO: crea variabili per i colori in un file di configurazione
  // (capire se possibile usare i colori del tema di material ui)
  const stackTheme = {
    light: {
      muted: '#90caf9',
      popoverForeground: '#3a3a40',
    },
    dark: {
      muted: '#52affa',
      popoverForeground: '#fafafa',
    },
  };

  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <StackTheme theme={stackTheme}>{children}</StackTheme>
    </ThemeProvider>
  );
}
