'use client';

import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import AddTournamentDialog from '@/components/AddTournamentDialog';
import DeleteTournamentConfirmDialog from '@/components/DeleteTournamentConfirmDialog';
import EditTournamentDialog from '@/components/EditTournamentDialog';
import { SelectTournament } from '@/db/schema';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useTournaments } from '@/hooks/useTournaments';

export default function Tournaments() {
  const t = useTranslations('tournaments');
  const { user, isChecking } = useProtectedRoute();
  const { tournaments, loading, fetchTournaments } = useTournaments(user);
  const [filteredTournaments, setFilteredTournaments] = useState<SelectTournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<SelectTournament | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box>
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            {t('title')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <TextField
              size="small"
              placeholder={t('search_tournaments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 250 } }}
            />
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('add_tournament')}
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
              ? t('no_tournaments_found')
              : t('no_tournaments_match_search_criteria')}
          </Typography>
        ) : isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} sx={{ width: '100%' }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                      {tournament.name}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
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
                    </Box>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {t('card_start_date')}: {formatDate(tournament.startDate)}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {t('card_end_date')}: {formatDate(tournament.endDate)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {t('duration')}:{' '}
                    {tournament.endDate
                      ? `${Math.ceil(
                          (new Date(tournament.endDate).getTime() -
                            new Date(tournament.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} ${t('days')}`
                      : t('ongoing')}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table_header_name')}</TableCell>
                  <TableCell>{t('table_header_start_date')}</TableCell>
                  <TableCell>{t('table_header_end_date')}</TableCell>
                  <TableCell>{t('table_header_duration')}</TableCell>
                  <TableCell align="right">{t('table_header_actions')}</TableCell>
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
                          )} ${t('days')}`
                        : t('ongoing')}
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
      </Box>

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
