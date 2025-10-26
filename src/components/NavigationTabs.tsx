import { Dashboard, EmojiEvents, People, SportsBaseball } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  getTabValue: () => number;
};

export const NavigationTabs: FC<Props> = ({ getTabValue }) => {
  const t = useTranslations('navigation_tabs');
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
          label={t('dashboard')}
          component={Link}
          href="/"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<SportsBaseball />}
          label={t('games')}
          component={Link}
          href="/games"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<People />}
          label={t('players')}
          component={Link}
          href="/players"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
        <Tab
          icon={<EmojiEvents />}
          label={t('tournaments')}
          component={Link}
          href="/tournaments"
          sx={{ display: { xs: 'flex', sm: 'flex' } }}
        />
      </Tabs>
    </Box>
  );
};
