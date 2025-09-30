'use client';

import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Layout from '@/components/Layout';
import AddPlayerDialog from '@/components/AddPlayerDialog';
import EditPlayerDialog from '@/components/EditPlayerDialog';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useState, useEffect } from 'react';
import { SelectPlayer } from '@/db/schema';

export default function Players() {
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectPlayer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handlePlayerAdded = () => {
    fetchPlayers();
  };

  const handleEditClick = (player: SelectPlayer) => {
    setSelectedPlayer(player);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (player: SelectPlayer) => {
    setSelectedPlayer(player);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPlayer) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/players/${selectedPlayer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete player');
      }

      fetchPlayers();
      setDeleteDialogOpen(false);
      setSelectedPlayer(null);
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePlayerUpdated = () => {
    fetchPlayers();
  };

  const calculateAge = (dob: Date) => {
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age;
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4">Players</Typography>
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              Add Player
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : players.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
              No players found. Add your first player to get started.
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Nickname</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Age</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.nickname || '-'}</TableCell>
                      <TableCell>
                        {new Date(player.dob).toLocaleDateString('it-IT')}
                      </TableCell>
                      <TableCell>{calculateAge(new Date(player.dob))}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEditClick(player)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(player)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <AddPlayerDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onPlayerAdded={handlePlayerAdded}
        />

        <EditPlayerDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onPlayerUpdated={handlePlayerUpdated}
          player={selectedPlayer}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          playerName={selectedPlayer?.name || ''}
          loading={deleteLoading}
        />
      </Box>
    </Layout>
  );
}
