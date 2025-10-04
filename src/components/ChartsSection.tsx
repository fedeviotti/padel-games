import { Box, Typography } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { FC } from 'react';
import { SelectPlayer } from '@/db/schema';

type Props = {
  selectedPlayer: SelectPlayer;
  selectedOpponent: SelectPlayer;
};

export const ChartsSection: FC<Props> = ({ selectedPlayer, selectedOpponent }) => (
  <>
    <Typography variant="h6" sx={{ mb: 3 }}>
      Total games played: {selectedPlayer.nickname || 0}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <Typography variant="body1">Percentage of wins in games played last month</Typography>
      <Gauge value={60} />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <Typography variant="body1">
        Percentage of wins in games played last month against selected player
      </Typography>
      <Gauge value={60} />
    </Box>
  </>
);
