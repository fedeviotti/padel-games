'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { SelectPlayer } from '@/db/schema';

interface AddGameDialogProps {
  open: boolean;
  onClose: () => void;
  onGameAdded: () => void;
}

export default function AddGameDialog({
  open,
  onClose,
  onGameAdded,
}: AddGameDialogProps) {
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [formData, setFormData] = useState({
    playedAt: new Date().toISOString().split('T')[0],
    team1Player1: '',
    team1Player2: '',
    team2Player1: '',
    team2Player2: '',
    team1SetScore: '',
    team2SetScore: '',
    winningTeam: '',
    totalGamesDifference: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPlayers();
    }
  }, [open]);

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
          winningTeam: parseInt(formData.winningTeam),
          totalGamesDifference: parseInt(formData.totalGamesDifference),
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
        winningTeam: '',
        totalGamesDifference: '',
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Game</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Date Played"
              type="date"
              required
              fullWidth
              value={formData.playedAt}
              onChange={(e) =>
                setFormData({ ...formData, playedAt: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              Team 1
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Player 1</InputLabel>
                <Select
                  value={formData.team1Player1}
                  label="Player 1"
                  onChange={(e) =>
                    setFormData({ ...formData, team1Player1: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, team1Player2: e.target.value })
                  }
                >
                  {players.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Team 2
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Player 1</InputLabel>
                <Select
                  value={formData.team2Player1}
                  label="Player 1"
                  onChange={(e) =>
                    setFormData({ ...formData, team2Player1: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, team2Player2: e.target.value })
                  }
                >
                  {players.map((player) => (
                    <MenuItem key={player.id} value={player.id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                onChange={(e) =>
                  setFormData({ ...formData, team1SetScore: e.target.value })
                }
              />
              <TextField
                label="Team 2 Set Score"
                type="number"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={formData.team2SetScore}
                onChange={(e) =>
                  setFormData({ ...formData, team2SetScore: e.target.value })
                }
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Winning Team</InputLabel>
                <Select
                  value={formData.winningTeam}
                  label="Winning Team"
                  onChange={(e) =>
                    setFormData({ ...formData, winningTeam: e.target.value })
                  }
                >
                  <MenuItem value={1}>Team 1</MenuItem>
                  <MenuItem value={2}>Team 2</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Total Games Difference"
                type="number"
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                value={formData.totalGamesDifference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalGamesDifference: e.target.value,
                  })
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
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
