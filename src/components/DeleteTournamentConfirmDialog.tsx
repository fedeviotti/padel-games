'use client';

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteTournamentConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tournamentName: string;
  loading: boolean;
}

export default function DeleteTournamentConfirmDialog({
  open,
  onClose,
  onConfirm,
  tournamentName,
  loading,
}: DeleteTournamentConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Tournament</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the tournament &#34;{tournamentName}&#34;? This action
          cannot be undone.
          <br />
          <br />
          <strong>Note:</strong> You can only delete tournaments that have no games associated with
          them.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} /> : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
