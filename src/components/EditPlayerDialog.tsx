'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { SelectPlayer } from '@/db/schema';

interface EditPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onPlayerUpdated: () => void;
  player: SelectPlayer | null;
}

export default function EditPlayerDialog({
  open,
  onClose,
  onPlayerUpdated,
  player,
}: EditPlayerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    nickname: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        dob: new Date(player.dob).toISOString().split('T')[0],
        nickname: player.nickname || '',
      });
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!player) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/players/${player.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update player');
      }

      onPlayerUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Failed to update player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Player</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="Date of Birth"
              type="date"
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
            />
            <TextField
              label="Nickname"
              fullWidth
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Player'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
