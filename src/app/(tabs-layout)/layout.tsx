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
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 1, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {user && <NavigationTabs getTabValue={getTabValue} />}
        <Box sx={{ flexGrow: 1, overflow: 'auto', py: { xs: 1, sm: 2 } }}>{children}</Box>
      </Container>
    </Box>
  );
}
