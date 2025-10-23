'use client';

import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppBar, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { useTheme as useNextTheme } from 'next-themes';
import { padelGamesColors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

export function AppBarComponent() {
  const { mode, toggleColorMode } = useTheme();
  const { theme, setTheme } = useNextTheme();

  const handleThemeChange = () => {
    toggleColorMode();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Padel Games
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          color={
            theme === 'dark'
              ? padelGamesColors.dark.popoverForeground
              : padelGamesColors.light.popoverForeground
          }
        >
          <IconButton
            sx={{ ml: 1, color: '#fff' }}
            onClick={handleThemeChange}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <UserButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
