import { Dashboard, EmojiEvents, People, SportsBaseball } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  getTabValue: () => number;
};

export const NavigationTabs: FC<Props> = ({ getTabValue }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={getTabValue()}
        aria-label="navigation tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            minWidth: { xs: 'auto', sm: 'auto' },
            padding: { xs: '12px 8px', sm: '12px 16px' },
          },
        }}
      >
        <Tab
          icon={<Dashboard />}
          label="Dashboard"
          component={Link}
          href="/"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<SportsBaseball />}
          label="Games"
          component={Link}
          href="/games"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<People />}
          label="Players"
          component={Link}
          href="/players"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<EmojiEvents />}
          label="Tournaments"
          component={Link}
          href="/tournaments"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
      </Tabs>
    </Box>
  );
};
