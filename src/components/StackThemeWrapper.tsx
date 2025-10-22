'use client';

import { StackTheme } from '@stackframe/stack';
import { ReactNode } from 'react';

interface StackThemeWrapperProps {
  children: ReactNode;
}

export function StackThemeWrapper({ children }: StackThemeWrapperProps) {
  // Configure StackTheme to match Material-UI theme
  const stackTheme = {
    light: {
      primary: '#1976d2', // Material-UI primary blue
      primaryForeground: '#ffffff', // White text for good contrast
    },
    dark: {
      primary: '#90caf9', // Material-UI light primary for dark mode
      primaryForeground: '#000000', // Black text for contrast against light background
    },
    radius: '8px',
  };

  return <StackTheme theme={stackTheme}>{children}</StackTheme>;
}
