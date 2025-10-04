'use client';

import { Autocomplete, Box, Divider, Paper, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { ChartsSection } from '@/components/ChartsSection';
import { SelectPlayer } from '@/db/schema';
import { usePlayers } from '@/hooks/usePlayers';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loading from '../loading';

export default function Dashboard() {
  const { user, isChecking } = useProtectedRoute();
  const { players, loading } = usePlayers(user);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectPlayer | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<SelectPlayer | null>(null);

  if (isChecking) return <Loading />;

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to Padel Games!{' '}
            <Link href="/handler/sign-in" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Login
            </Link>{' '}
            to see your dashboard.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to Padel Games {user?.displayName || user?.primaryEmail?.split('@')[0]}! Here you
          can see statistics of your games.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box display="flex" gap={2} alignItems="center" mb={2} sx={{ flexWrap: 'wrap' }}>
            <Autocomplete
              size="small"
              value={selectedPlayer}
              onChange={(_, newValue) => setSelectedPlayer(newValue)}
              options={players}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              loading={loading}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Player" placeholder="Choose a player" />
              )}
            />
            <Autocomplete
              size="small"
              value={selectedOpponent}
              onChange={(_, newValue) => setSelectedOpponent(newValue)}
              options={players.filter((player) => player.id !== selectedPlayer?.id)}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              loading={loading}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select Opponent" placeholder="Choose an opponent" />
              )}
            />
          </Box>
          {selectedPlayer && selectedOpponent ? (
            <ChartsSection selectedPlayer={selectedPlayer} selectedOpponent={selectedOpponent} />
          ) : (
            <Box>Select the player and the opponent</Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
