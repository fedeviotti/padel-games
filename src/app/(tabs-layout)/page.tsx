'use client';

import { Autocomplete, Box, Divider, Paper, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { PlayerChartsSection } from '@/components/PlayerChartsSection';
import { PlayerOpponentChartsSection } from '@/components/PlayerOpponentChartsSection';
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
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            Welcome to Padel Games {user?.displayName || user?.primaryEmail?.split('@')[0]}! Here
            you can see statistics of your games.
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            <Autocomplete
              size="small"
              value={selectedPlayer}
              onChange={(_, newValue) => setSelectedPlayer(newValue)}
              options={players}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              loading={loading}
              sx={{ width: { xs: '100%', md: 250 } }}
              renderInput={(params) => (
                <TextField {...params} label="Select Player" placeholder="Choose a player" />
              )}
            />

            {selectedPlayer ? (
              <PlayerChartsSection selectedPlayer={selectedPlayer} />
            ) : (
              <Box height={150} sx={{ display: { xs: 'none', md: 'block' } }}>
                Select a player to see his statistics
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'flex-start' },
            }}
          >
            <Autocomplete
              size="small"
              value={selectedOpponent}
              onChange={(_, newValue) => setSelectedOpponent(newValue)}
              options={players.filter((player) => player.id !== selectedPlayer?.id)}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              loading={loading}
              sx={{ width: { xs: '100%', md: 250 } }}
              renderInput={(params) => (
                <TextField {...params} label="Select Opponent" placeholder="Choose an opponent" />
              )}
            />
            {selectedPlayer && selectedOpponent ? (
              <PlayerOpponentChartsSection
                selectedPlayer={selectedPlayer}
                selectedOpponent={selectedOpponent}
              />
            ) : (
              <Box height={150} sx={{ display: { xs: 'none', md: 'block' } }}>
                Select an opponent to see the statistics of the games against him
              </Box>
            )}
          </Box>
        </Box>
        {/* TODO: aggiungere la selezione multipla dell'avversario per vedere
        le statistiche di gioco con i vari avversari */}
        {/* TODO: aggiungere la selezione del partner e delle 
        statistiche di gioco con il partner */}
        {/* TODO: aggiungere selezione multipla del partner per vedere 
        le statistiche di gioco con i vari partner */}
      </Paper>
    </Box>
  );
}
