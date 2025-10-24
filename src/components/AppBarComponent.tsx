'use client';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { padelGamesColors } from '@/constants/colors';
import { ToggleColorMode } from './ToggleColorMode';

export function AppBarComponent() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useNextTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getUserButtonColor = () => {
    return theme === 'light' ? padelGamesColors.light.popoverForeground : 'inherit';
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Padel Games
        </Typography>
        <Stack direction="row" spacing={1}>
          <ToggleColorMode />
          {isClient && (
            <Box sx={{ color: getUserButtonColor() }}>
              <UserButton />
            </Box>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
