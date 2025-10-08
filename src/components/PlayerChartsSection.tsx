import { Box, Skeleton, Typography } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import { FC, useEffect, useState } from 'react';
import { SelectPlayer } from '@/db/schema';

type Props = {
  selectedPlayer: SelectPlayer;
};

export const PlayerChartsSection: FC<Props> = ({ selectedPlayer }) => {
  const [totalGamesPlayed, setTotalGamesPlayed] = useState<number>(0);
  const [totalWins, setTotalWins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [winRate, setWinRate] = useState<number>(0);

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

  useEffect(() => {
    if (totalGamesPlayed > 0) {
      setWinRate(Math.round((totalWins / totalGamesPlayed) * 100));
    }
  }, [totalGamesPlayed, totalWins]);

  return (
    <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 250,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography>Total games played</Typography>
          <Typography>{loading ? 'Loading...' : totalGamesPlayed}</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography>Total wins</Typography>
          <Typography>{loading ? 'Loading...' : totalWins}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Typography>Win rate</Typography>
        {loading ? (
          <Skeleton width={150} height={150} variant="circular" />
        ) : (
          <Gauge width={150} height={150} value={winRate} />
        )}
      </Box>
    </Box>
  );
};
