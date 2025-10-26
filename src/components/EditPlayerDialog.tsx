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
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName || '',
        lastName: player.lastName,
        yearOfBirth: player.yearOfBirth || '',
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{t('edit_player')}</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('updating') : t('edit_player')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
