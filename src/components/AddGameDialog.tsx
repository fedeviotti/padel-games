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
import { useEffect, useState } from 'react';
import { SelectPlayer, SelectTournament } from '@/db/schema';

interface AddGameDialogProps {
  open: boolean;
  onClose: () => void;
  onGameAdded: () => void;
}

export default function AddGameDialog({ open, onClose, onGameAdded }: AddGameDialogProps) {
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
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Add New Game</DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Date Played"
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
                    label="Tournament (Optional)"
                    placeholder="Select a tournament"
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
                  Team 1
                </Typography>
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team1Player1) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1Player1: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Player 1" placeholder="Select player" required />
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
                    <TextField {...params} label="Player 2" placeholder="Select player" required />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                  Team 2
                </Typography>
                <Autocomplete
                  options={players}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                  value={players.find((p) => p.id.toString() === formData.team2Player1) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2Player1: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Player 1" placeholder="Select player" required />
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
                    <TextField {...params} label="Player 2" placeholder="Select player" required />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Score
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                label="Team 1 Set Score"
                type="number"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={formData.team1SetScore}
                onChange={(e) => setFormData({ ...formData, team1SetScore: e.target.value })}
              />
              <TextField
                label="Team 2 Set Score"
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
                label="Winner"
                fullWidth
                value={getWinningTeam() > 0 ? `Team ${getWinningTeam()}` : 'Tie'}
                disabled
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Games Difference"
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
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add Game'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
