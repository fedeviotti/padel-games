'use client';

import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import AddPlayerDialog from '@/components/AddPlayerDialog';
import DeletePlayerConfirmDialog from '@/components/DeletePlayerConfirmDialog';
import EditPlayerDialog from '@/components/EditPlayerDialog';
import { SelectPlayer } from '@/db/schema';
import { usePlayers } from '@/hooks/usePlayers';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function Players() {
  const { user, isChecking } = useProtectedRoute();
  const { players, loading, fetchPlayers } = usePlayers(user);
  const [filteredPlayers, setFilteredPlayers] = useState<SelectPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<SelectPlayer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter((player) => {
        const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      });
      setFilteredPlayers(filtered);
    }
  }, [searchTerm, players]);

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

  const calculateAge = (yearOfBirth: string) => {
    const currentYear = new Date().getFullYear();
    return currentYear - parseInt(yearOfBirth);
  };

  if (isChecking) return <Loading />;

  return (
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250 }}
            />
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add Player
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredPlayers.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
            {players.length === 0
              ? 'No players found. Add your first player to get started.'
              : 'No players match your search criteria.'}
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Nickname</TableCell>
                  <TableCell>Year of Birth</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      {player.firstName} {player.lastName}
                    </TableCell>
                    <TableCell>{player.nickname || '-'}</TableCell>
                    <TableCell>{player.yearOfBirth || '-'}</TableCell>
                    <TableCell>
                      {player.yearOfBirth ? calculateAge(player.yearOfBirth) : '-'}
                    </TableCell>
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

      <DeletePlayerConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        playerName={`${selectedPlayer?.firstName} ${selectedPlayer?.lastName}` || ''}
        loading={deleteLoading}
      />
    </Box>
  );
}
