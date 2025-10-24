'use client';

import { AppBar, Box, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { useTheme as useNextTheme } from 'next-themes';
import { padelGamesColors } from '@/constants/colors';
import { ToggleColorMode } from './ToggleColorMode';

export function AppBarComponent() {
  const { theme } = useNextTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const getUserButtonColor = () => {
    if (theme === 'light') {
      return padelGamesColors.light.popoverForeground;
    }
    return prefersDarkMode
      ? padelGamesColors.dark.popoverForeground
      : padelGamesColors.light.popoverForeground;
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Padel Games
        </Typography>
        <Stack direction="row" spacing={1}>
          <ToggleColorMode />
          <Box color={getUserButtonColor()}>
            <UserButton />
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
