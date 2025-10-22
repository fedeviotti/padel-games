'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SelectTournament } from '@/db/schema';

interface EditTournamentDialogProps {
  open: boolean;
  onClose: () => void;
  onTournamentUpdated: () => void;
  tournament: SelectTournament | null;
}

export default function EditTournamentDialog({
  open,
  onClose,
  onTournamentUpdated,
  tournament,
}: EditTournamentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        startDate: tournament.startDate
          ? new Date(tournament.startDate).toISOString().split('T')[0]
          : '',
        endDate: tournament.endDate ? new Date(tournament.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [tournament]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournament) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/tournaments/${tournament.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tournament');
      }

      onTournamentUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating tournament:', error);
      alert('Failed to update tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Tournament</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tournament Name"
              required
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Start Date"
              type="date"
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              slotProps={{
                htmlInput: {
                  min: formData.startDate,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update Tournament'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
