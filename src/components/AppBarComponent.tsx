'use client';

import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ToggleColorMode } from './ToggleColorMode';
import { UserButton } from './UserButton';

export function AppBarComponent() {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('app_bar');

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          {isClient && <UserButton />}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
