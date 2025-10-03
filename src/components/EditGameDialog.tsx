'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectGame, SelectPlayer } from '@/db/schema';

type GameWithPlayers = SelectGame & {
  team1Player1Name: string;
  team1Player2Name: string;
  team2Player1Name: string;
  team2Player2Name: string;
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
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [formData, setFormData] = useState({
    playedAt: '',
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    team1SetScore: '',
    team2SetScore: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlayers();
    }
  }, [open]);

  useEffect(() => {
    if (game) {
      setFormData({
        playedAt: game.playedAt ? new Date(game.playedAt).toISOString().split('T')[0] : '',
        team1Player1: game.team1Player1.toString(),
        team1Player2: game.team1Player2.toString(),
        team2Player1: game.team2Player1.toString(),
        team2Player2: game.team2Player2.toString(),
        team1SetScore: game.team1SetScore.toString(),
        team2SetScore: game.team2SetScore.toString(),
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
          team1Player1: parseInt(formData.team1Player1),
          team1Player2: parseInt(formData.team1Player2),
          team2Player1: parseInt(formData.team2Player1),
          team2Player2: parseInt(formData.team2Player2),
          team1SetScore: parseInt(formData.team1SetScore),
          team2SetScore: parseInt(formData.team2SetScore),
          winningTeam: getWinningTeam(),
          totalGamesDifference,
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Game</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date Played"
              type="date"
              required
              fullWidth
              value={formData.playedAt}
              onChange={(e) => setFormData({ ...formData, playedAt: e.target.value })}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <Box sx={{ display: 'flex' }}>
              <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                Team 1
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                Team 2
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Player 1</InputLabel>
                  <Select
                    value={formData.team1Player1}
                    label="Player 1"
                    onChange={(e) => setFormData({ ...formData, team1Player1: e.target.value })}
                  >
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Player 2</InputLabel>
                  <Select
                    value={formData.team1Player2}
                    label="Player 2"
                    onChange={(e) => setFormData({ ...formData, team1Player2: e.target.value })}
                  >
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Player 1</InputLabel>
                  <Select
                    value={formData.team2Player1}
                    label="Player 1"
                    onChange={(e) => setFormData({ ...formData, team2Player1: e.target.value })}
                  >
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Player 2</InputLabel>
                  <Select
                    value={formData.team2Player2}
                    label="Player 2"
                    onChange={(e) => setFormData({ ...formData, team2Player2: e.target.value })}
                  >
                    {players.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Score
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
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

            <Box sx={{ display: 'flex', gap: 2 }}>
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
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Game'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
