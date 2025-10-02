import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Link from 'next/link';
import { FC } from 'react';
import {
  Dashboard,
  SportsBaseball,
  People,
  EmojiEvents,
} from '@mui/icons-material';

type Props = {
  getTabValue: () => number;
}

export const NavigationTabs: FC<Props> = ({ getTabValue }) => {
  return (
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
  )
}