'use client';

import { AppBar, Stack, Toolbar, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { UserButton } from './UserButton';

export function AppBarComponent() {
  const t = useTranslations('app_bar');

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          {t('title')}
        </Typography>
        <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }}>
          <UserButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
