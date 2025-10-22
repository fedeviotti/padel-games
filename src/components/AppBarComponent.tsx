'use client';

import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AppBar, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { useTheme } from '@/contexts/ThemeContext';

export function AppBarComponent() {
  const { mode, toggleColorMode } = useTheme();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Padel Games
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleColorMode}
            color="inherit"
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
