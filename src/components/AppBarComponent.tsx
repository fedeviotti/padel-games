'use client';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { useTranslations } from 'next-intl';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { padelGamesColors } from '@/constants/colors';
import { ToggleColorMode } from './ToggleColorMode';

export function AppBarComponent() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useNextTheme();
  const t = useTranslations('metadata');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getUserButtonColor = () => {
    return theme === 'light' ? padelGamesColors.light.popoverForeground : 'inherit';
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          {t('title')}
        </Typography>
        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
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
