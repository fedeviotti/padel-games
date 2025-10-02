'use client';

import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { UserButton } from '@stackframe/stack';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { NavigationTabs } from '@/components/NavigationTabs';
import { stackClientApp } from '@/stack/client';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const user = stackClientApp.useUser();

  const getTabValue = () => {
    switch (pathname) {
      case '/':
        return 0;
      case '/games':
        return 1;
      case '/players':
        return 2;
      case '/tournaments':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Padel Games
          </Typography>
          <UserButton />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {user && <NavigationTabs getTabValue={getTabValue} />}
        {children}
      </Container>
    </Box>
  );
}
