'use client';

import { Autocomplete, Box, Divider, TextField, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { PlayerChartsSection } from '@/components/PlayerChartsSection';
import { PlayerOpponentChartsSection } from '@/components/PlayerOpponentChartsSection';
import { SelectPlayer } from '@/db/schema';
import { usePlayers } from '@/hooks/usePlayers';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loading from '../loading';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  const { user, isChecking } = useProtectedRoute();
  const { players, loading } = usePlayers(user);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectPlayer | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<SelectPlayer | null>(null);

  if (isChecking) return <Loading />;

  if (!user) {
    return (
      <Box>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="body1">
            {t('welcome_no_name')}{' '}
            <Link href="/handler/sign-in" style={{ color: 'inherit', textDecoration: 'underline' }}>
              {t('login')}
            </Link>{' '}
            {t('to_see_dashboard')}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {t('title')}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {t('welcome_name', {
              name: user?.displayName || user?.primaryEmail?.split('@')[0] || '',
            })}{' '}
            {t('welcome_message')}
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
              loadingText={t('loading')}
              noOptionsText={t('no_players_found')}
              sx={{ width: { xs: '100%', md: 250 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('select_player')}
                  placeholder={t('choose_player')}
                />
              )}
            />

            {selectedPlayer ? (
              <PlayerChartsSection selectedPlayer={selectedPlayer} />
            ) : (
              <Box height={150} sx={{ display: { xs: 'none', md: 'block' } }}>
                {t('select_player_to_see_statistics')}
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
              loadingText={t('loading')}
              noOptionsText={t('no_opponents_found')}
              sx={{ width: { xs: '100%', md: 250 } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('select_opponent')}
                  placeholder={t('choose_opponent')}
                />
              )}
            />
            {selectedPlayer && selectedOpponent ? (
              <PlayerOpponentChartsSection
                selectedPlayer={selectedPlayer}
                selectedOpponent={selectedOpponent}
              />
            ) : (
              <Box height={150} sx={{ display: { xs: 'none', md: 'block' } }}>
                {t('select_opponent_to_see_statistics')}
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
      </Box>
    </Box>
  );
}
