import { Box, Typography } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { FC, useEffect, useState } from 'react';
import { SelectPlayer } from '@/db/schema';

type Props = {
  selectedPlayer: SelectPlayer;
  selectedOpponent: SelectPlayer;
};

export const ChartsSection: FC<Props> = ({ selectedPlayer }) => {
  const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTotalGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/players/${selectedPlayer.id}/total-games`);

        if (!response.ok) {
          throw new Error('Failed to fetch total games played');
        }

        const data = await response.json();
        setTotalGamesPlayed(data.totalGames);
      } catch (error) {
        console.error('Error fetching total games played:', error);
        setTotalGamesPlayed(0);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPlayer?.id) {
      fetchTotalGames();
    }
  }, [selectedPlayer?.id]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Total games played: {loading ? 'Loading...' : totalGamesPlayed}
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
};
