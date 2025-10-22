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
import AddTournamentDialog from '@/components/AddTournamentDialog';
import DeleteTournamentConfirmDialog from '@/components/DeleteTournamentConfirmDialog';
import EditTournamentDialog from '@/components/EditTournamentDialog';
import { SelectTournament } from '@/db/schema';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useTournaments } from '@/hooks/useTournaments';

export default function Tournaments() {
  const { user, isChecking } = useProtectedRoute();
  const { tournaments, loading, fetchTournaments } = useTournaments(user);
  const [filteredTournaments, setFilteredTournaments] = useState<SelectTournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<SelectTournament | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTournaments(tournaments);
    } else {
      const filtered = tournaments.filter((tournament) => {
        return tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredTournaments(filtered);
    }
  }, [searchTerm, tournaments]);

  const handleTournamentAdded = () => {
    fetchTournaments();
  };

  const handleEditClick = (tournament: SelectTournament) => {
    setSelectedTournament(tournament);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (tournament: SelectTournament) => {
    setSelectedTournament(tournament);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTournament) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/tournaments/${selectedTournament.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tournament');
      }

      fetchTournaments();
      setDeleteDialogOpen(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete tournament');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTournamentUpdated = () => {
    fetchTournaments();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
          <Typography variant="h4">Tournaments</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search tournaments..."
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
              Add Tournament
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredTournaments.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
            {tournaments.length === 0
              ? 'No tournaments found. Add your first tournament to get started.'
              : 'No tournaments match your search criteria.'}
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>{formatDate(tournament.startDate)}</TableCell>
                    <TableCell>{formatDate(tournament.endDate)}</TableCell>
                    <TableCell>
                      {tournament.endDate
                        ? `${Math.ceil(
                            (new Date(tournament.endDate).getTime() -
                              new Date(tournament.startDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : 'Ongoing'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(tournament)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(tournament)}
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

      <AddTournamentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onTournamentAdded={handleTournamentAdded}
      />

      <EditTournamentDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onTournamentUpdated={handleTournamentUpdated}
        tournament={selectedTournament}
      />

      <DeleteTournamentConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        tournamentName={selectedTournament?.name || ''}
        loading={deleteLoading}
      />
    </Box>
  );
}
