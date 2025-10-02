'use client';

import { AppBar, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';

export function AppBarComponent() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Padel Games
        </Typography>
        <UserButton />
      </Toolbar>
    </AppBar>
  );
}
