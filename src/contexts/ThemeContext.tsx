'use client';

import { colors } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { padelGamesColors } from '@/constants/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface CustomThemeProviderProps {
  children: ReactNode;
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode colors
            primary: {
              main: padelGamesColors.light.primary.main,
            },
            secondary: {
              main: padelGamesColors.light.secondary.main,
            },
          }
        : {
            // Dark mode colors
            primary: {
              main: padelGamesColors.dark.primary.main,
            },
            secondary: {
              main: padelGamesColors.dark.secondary.main,
            },
            background: {
              default: padelGamesColors.dark.background.default,
              paper: padelGamesColors.dark.background.paper,
            },
          }),
    },
    typography: {
      fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'light' ? padelGamesColors.light.primary.main : colors.grey[700],
          },
        },
      },
    },
  });

  const contextValue: ThemeContextType = {
    mode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
