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
import { SelectGame, SelectPlayer, SelectTournament } from '@/db/schema';

type GameWithPlayers = SelectGame & {
  team1PlayerDxName: string;
  team1PlayerSxName: string;
  team2PlayerDxName: string;
  team2PlayerSxName: string;
};

interface EditGameDialogProps {
  open: boolean;
  onClose: () => void;
  onGameUpdated: () => void;
  game: GameWithPlayers | null;
}

export default function EditGameDialog({
  open,
  onClose,
  onGameUpdated,
  game,
}: EditGameDialogProps) {
  const t = useTranslations('games');
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [tournaments, setTournaments] = useState<SelectTournament[]>([]);
  const [formData, setFormData] = useState({
    playedAt: '',
    team1PlayerDx: '',
    team1PlayerSx: '',
    team2PlayerDx: '',
    team2PlayerSx: '',
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

  useEffect(() => {
    if (game) {
      setFormData({
        playedAt: game.playedAt ? new Date(game.playedAt).toISOString().split('T')[0] : '',
        team1PlayerDx: game.team1PlayerDx.toString(),
        team1PlayerSx: game.team1PlayerSx.toString(),
        team2PlayerDx: game.team2PlayerDx.toString(),
        team2PlayerSx: game.team2PlayerSx.toString(),
        team1SetScore: game.team1SetScore.toString(),
        team2SetScore: game.team2SetScore.toString(),
        tournamentId: game.tournamentId ? game.tournamentId.toString() : '',
      });
    }
  }, [game]);

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
    if (!game) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          team1PlayerDx: parseInt(formData.team1PlayerDx),
          team1PlayerSx: parseInt(formData.team1PlayerSx),
          team2PlayerDx: parseInt(formData.team2PlayerDx),
          team2PlayerSx: parseInt(formData.team2PlayerSx),
          team1SetScore: parseInt(formData.team1SetScore),
          team2SetScore: parseInt(formData.team2SetScore),
          winningTeam: getWinningTeam(),
          totalGamesDifference,
          tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update game');
      }

      onGameUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Failed to update game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {t('edit_game')}
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
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerDx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team1PlayerDx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1PlayerDx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_dx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team2PlayerDx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team1PlayerSx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1PlayerSx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_sx')}
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
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team2PlayerDx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2PlayerDx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_dx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerDx
                  )}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team2PlayerSx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2PlayerSx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_sx')}
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
            {loading ? t('updating') : t('edit_game')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
