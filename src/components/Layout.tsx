'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard,
  SportsBaseball,
  People,
  EmojiEvents,
} from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  
  const getTabValue = () => {
    console.log('pathname', pathname);
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
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Padel Games
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={getTabValue()} aria-label="navigation tabs">
            <Tab 
              icon={<Dashboard />} 
              label="Dashboard" 
              component={Link}
              href="/dashboard"
            />
            <Tab 
              icon={<SportsBaseball />} 
              label="Games" 
              component={Link}
              href="/games"
            />
            <Tab 
              icon={<People />} 
              label="Players" 
              component={Link}
              href="/players"
            />
            <Tab 
              icon={<EmojiEvents />} 
              label="Tournaments" 
              component={Link}
              href="/tournaments"
            />
          </Tabs>
        </Box>

        {children}
      </Container>
    </Box>
  );
}
