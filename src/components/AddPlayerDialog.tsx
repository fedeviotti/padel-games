'use client';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AddPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onPlayerAdded: () => void;
}

export default function AddPlayerDialog({ open, onClose, onPlayerAdded }: AddPlayerDialogProps) {
  const t = useTranslations('players');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    yearOfBirth: '',
    nickname: '',
  });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

      setFormData({ firstName: '', lastName: '', yearOfBirth: '', nickname: '' });
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {t('add_player')}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('add_edit_player.first_name')}
              fullWidth
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
              label={t('add_edit_player.last_name')}
              required
              fullWidth
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            <TextField
              label={t('add_edit_player.year_of_birth')}
              type="number"
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 1900,
                  max: new Date().getFullYear(),
                  step: 1,
                },
              }}
              value={formData.yearOfBirth}
              onChange={(e) => setFormData({ ...formData, yearOfBirth: e.target.value })}
            />
            <TextField
              label={t('add_edit_player.nickname')}
              fullWidth
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('adding') : t('add_player')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
