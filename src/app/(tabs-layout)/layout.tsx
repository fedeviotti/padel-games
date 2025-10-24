'use client';

import { Box, Container } from '@mui/material';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { NavigationTabs } from '@/components/NavigationTabs';
import { stackClientApp } from '@/stack/client';

export default function TabsLayout({ children }: { children: ReactNode }) {
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
      <Container maxWidth="lg" sx={{ mt: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 } }}>
        {user && <NavigationTabs getTabValue={getTabValue} />}
        {children}
      </Container>
    </Box>
  );
}
