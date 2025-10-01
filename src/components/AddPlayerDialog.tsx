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
import { useState } from 'react';

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onPlayerAdded: () => void;
}

export default function AddPlayerDialog({
  open,
  onClose,
  onPlayerAdded,
}: AddPlayerDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    yearOfBirth: '',
    nickname: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add player');
      }

      setFormData({ name: '', yearOfBirth: '', nickname: '' });
      onPlayerAdded();
      onClose();
    } catch (error) {
      console.error('Error adding player:', error);
      alert('Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add New Player</DialogTitle>
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
              label="Year of Birth"
              type="number"
              fullWidth
              slotProps={{ 
                htmlInput: { 
                  min: 1900, 
                  max: new Date().getFullYear(),
                  step: 1 
                } 
              }}
              value={formData.yearOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, yearOfBirth: e.target.value })
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
            {loading ? 'Adding...' : 'Add Player'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
