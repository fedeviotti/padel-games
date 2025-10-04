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
  const [totalWins, setTotalWins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setLoading(true);

        // Fetch total games played
        const gamesResponse = await fetch(`/api/players/${selectedPlayer.id}/total-games`);
        if (!gamesResponse.ok) {
          throw new Error('Failed to fetch total games played');
        }
        const gamesData = await gamesResponse.json();
        setTotalGamesPlayed(gamesData.totalGames);

        // Fetch total wins
        const winsResponse = await fetch(`/api/players/${selectedPlayer.id}/total-wins`);
        if (!winsResponse.ok) {
          throw new Error('Failed to fetch total wins');
        }
        const winsData = await winsResponse.json();
        setTotalWins(winsData.totalWins);
      } catch (error) {
        console.error('Error fetching player stats:', error);
        setTotalGamesPlayed(0);
        setTotalWins(0);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPlayer?.id) {
      fetchPlayerStats();
    }
  }, [selectedPlayer?.id]);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Total games played: {loading ? 'Loading...' : totalGamesPlayed}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Total wins: {loading ? 'Loading...' : totalWins}
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Win rate:{' '}
        {loading
          ? 'Loading...'
          : totalGamesPlayed > 0
            ? `${Math.round((totalWins / totalGamesPlayed) * 100)}%`
            : '0%'}
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
