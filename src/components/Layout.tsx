'use client';

import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { stackClientApp } from '@/stack/client';
import { ReactNode } from 'react';
import { UserButton } from '@stackframe/stack';
import { NavigationTabs } from '@/components/NavigationTabs';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const user = stackClientApp.useUser();
  
  const getTabValue = () => {
    switch (pathname) {
      case '/dashboard':
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
        {user && (<NavigationTabs getTabValue={getTabValue} />)}
        {children}
      </Container>
    </Box>
  );
}
