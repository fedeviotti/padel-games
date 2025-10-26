'use client';

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SelectPlayer, SelectTournament } from '@/db/schema';

interface AddGameDialogProps {
  open: boolean;
  onClose: () => void;
  onGameAdded: () => void;
}

export default function AddGameDialog({ open, onClose, onGameAdded }: AddGameDialogProps) {
  const t = useTranslations('games');
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [tournaments, setTournaments] = useState<SelectTournament[]>([]);
  const [formData, setFormData] = useState({
    playedAt: new Date().toISOString().split('T')[0],
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    team1SetScore: '',
    team2SetScore: '',
    tournamentId: '',
  });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      fetchPlayers();
      fetchTournaments();
    }
  }, [open]);

  // Calculate winning team and total games difference
  const getWinningTeam = () => {
    if (formData.team1SetScore && formData.team2SetScore) {
      if (parseInt(formData.team1SetScore) === parseInt(formData.team2SetScore)) {
        return 0;
      }
      if (parseInt(formData.team1SetScore) > parseInt(formData.team2SetScore)) {
        return 1;
      }
      return 2;
    }
    return 0;
  };

  const totalGamesDifference =
    formData.team1SetScore && formData.team2SetScore
      ? Math.abs(parseInt(formData.team1SetScore) - parseInt(formData.team2SetScore))
      : 0;

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          team1Player1: parseInt(formData.team1Player1),
          team1Player2: parseInt(formData.team1Player2),
          team2Player1: parseInt(formData.team2Player1),
          team2Player2: parseInt(formData.team2Player2),
          team1SetScore: parseInt(formData.team1SetScore),
          team2SetScore: parseInt(formData.team2SetScore),
          winningTeam: getWinningTeam(),
          totalGamesDifference,
          tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      setFormData({
        playedAt: new Date().toISOString().split('T')[0],
        team1Player1: '',
        team1Player2: '',
        team2Player1: '',
        team2Player2: '',
        team1SetScore: '',
        team2SetScore: '',
        tournamentId: '',
      });
      onGameAdded();
      onClose();
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {t('add_game')}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label={t('add_edit_game.date_played')}
                type="date"
                required
                value={formData.playedAt}
                onChange={(e) => setFormData({ ...formData, playedAt: e.target.value })}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <Autocomplete
                sx={{ flex: 1 }}
                options={tournaments}
                getOptionLabel={(option) => option.name}
                value={tournaments.find((t) => t.id.toString() === formData.tournamentId) || null}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, tournamentId: newValue?.id.toString() || '' })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('add_edit_game.tournament_optional')}
                    placeholder={t('add_edit_game.choose_tournament')}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                  {t('add_edit_game.team_1')}
                </Typography>
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team1Player1) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1Player1: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_1')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team1Player2) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1Player2: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_2')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                  {t('add_edit_game.team_2')}
                </Typography>
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team2Player1) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2Player1: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_1')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team2Player2) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2Player2: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_2')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
              {t('add_edit_game.score')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label={t('add_edit_game.team_1_set_score')}
                type="number"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={formData.team1SetScore}
                onChange={(e) => setFormData({ ...formData, team1SetScore: e.target.value })}
              />
              <TextField
                label={t('add_edit_game.team_2_set_score')}
                type="number"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={formData.team2SetScore}
                onChange={(e) => setFormData({ ...formData, team2SetScore: e.target.value })}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label={t('add_edit_game.winner')}
                fullWidth
                value={
                  getWinningTeam() > 0
                    ? `${t('add_edit_game.team')} ${getWinningTeam()}`
                    : t('add_edit_game.tie')
                }
                disabled
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label={t('add_edit_game.games_difference')}
                type="number"
                fullWidth
                value={totalGamesDifference || '0'}
                disabled
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('adding') : t('add_game')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
