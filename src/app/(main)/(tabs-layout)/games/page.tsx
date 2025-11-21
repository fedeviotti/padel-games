'use client';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import AddGameDialog from '@/components/AddGameDialog';
import DeleteGameConfirmDialog from '@/components/DeleteGameConfirmDialog';
import EditGameDialog from '@/components/EditGameDialog';
import { TEAM_1, TEAM_2 } from '@/constants/constants';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { GameWithPlayers } from '@/types/games';

export default function Games() {
  const t = useTranslations('games');
  const { user, isChecking } = useProtectedRoute();
  const [games, setGames] = useState<GameWithPlayers[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameWithPlayers | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (!response.ok) throw new Error('Failed to fetch games');
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  const handleGameAdded = () => {
    fetchGames();
  };

  const handleEditClick = (game: GameWithPlayers) => {
    setSelectedGame(game);
    setEditDialogOpen(true);
  };

  const handleGameUpdated = () => {
    fetchGames();
  };

  const handleDeleteClick = (game: GameWithPlayers) => {
    setSelectedGame(game);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGame) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/games/${selectedGame.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      fetchGames();
      setDeleteDialogOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error('Error deleting game:', error);
      alert('Failed to delete game');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getGameInfo = (game: GameWithPlayers | null) => {
    if (!game) return '';
    return `${game.team1PlayerDxName} 
    & ${game.team1PlayerSxName} 
    vs ${game.team2PlayerDxName} 
    & ${game.team2PlayerSxName}`;
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
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            {t('add_game')}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : games.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
            {t('no_games_found')}
          </Typography>
        ) : isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {games.map((game) => (
              <Card key={game.id} sx={{ width: '100%' }}>
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
                      {formatDate(game.playedAt)}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => handleEditClick(game)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(game)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {game.tournamentName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('card_tournament')}: {game.tournamentName}
                    </Typography>
                  )}

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 0.5, 
                        justifyContent: 'space-between', 
                        gap: 1 ,
                        backgroundColor: game.winner === TEAM_1 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                        border: game.winner === TEAM_1 ? '1px solid rgba(76, 175, 80, 0.3)' : 'none',
                      }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {game.team1PlayerDxName} ({t('dx')}) - {game.team1PlayerSxName} ({t('sx')})
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {game.team1SetsWon}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        p: 0.5, 
                        justifyContent: 'space-between', 
                        gap: 1,
                        backgroundColor: game.winner === TEAM_2 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                        border: game.winner === TEAM_2 ? '1px solid rgba(76, 175, 80, 0.3)' : 'none',
                      }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {game.team2PlayerDxName} ({t('dx')}) - {game.team2PlayerSxName} ({t('sx')})
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {game.team2SetsWon}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table_header_date')}</TableCell>
                  <TableCell>{t('table_header_tournament')}</TableCell>
                  <TableCell>{t('table_header_team_1')}</TableCell>
                  <TableCell>{t('table_header_team_2')}</TableCell>
                  <TableCell>{t('table_header_score')}</TableCell>
                  <TableCell>{t('table_header_winner')}</TableCell>
                  <TableCell align="right">{t('table_header_actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{formatDate(game.playedAt)}</TableCell>
                    <TableCell>{game.tournamentName || '-'}</TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          game.winner === TEAM_1 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                      }}
                    >
                      {game.team1PlayerDxName} ({t('dx')})
                      <br />
                      {game.team1PlayerSxName} ({t('sx')})
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          game.winner === TEAM_2 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                      }}
                    >
                      {game.team2PlayerDxName} ({t('dx')})
                      <br />
                      {game.team2PlayerSxName} ({t('sx')})
                    </TableCell>
                    <TableCell>
                      <span style={{ fontWeight: 'bold' }}>
                        {game.team1SetsWon} - {game.team2SetsWon}
                      </span>
                      <br />
                      {game.setsScoresText}
                    </TableCell>
                    <TableCell>{t(game.winner || 'unknown')}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEditClick(game)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(game)}
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

      <AddGameDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onGameAdded={handleGameAdded}
      />

      <EditGameDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onGameUpdated={handleGameUpdated}
        game={selectedGame}
      />

      <DeleteGameConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        gameInfo={getGameInfo(selectedGame)}
        loading={deleteLoading}
      />
    </Box>
  );
}
