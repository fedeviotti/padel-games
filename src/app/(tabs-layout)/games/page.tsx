'use client';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
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
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import AddGameDialog from '@/components/AddGameDialog';
import DeleteGameConfirmDialog from '@/components/DeleteGameConfirmDialog';
import EditGameDialog from '@/components/EditGameDialog';
import { SelectGame } from '@/db/schema';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

type GameWithPlayers = SelectGame & {
  team1Player1Name: string;
  team1Player2Name: string;
  team2Player1Name: string;
  team2Player2Name: string;
  tournamentName: string | null;
};

export default function Games() {
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
    return `${game.team1Player1Name} 
    & ${game.team1Player2Name} 
    vs ${game.team2Player1Name} 
    & ${game.team2Player2Name}`;
  };

  if (isChecking) return <Loading />;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
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
            Games
          </Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Game
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : games.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
            No games found. Add your first game to get started.
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
                      Tournament: {game.tournamentName}
                    </Typography>
                  )}

                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          game.winningTeam === 1 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                        p: 0.5,
                        border:
                          game.winningTeam === 1 ? '1px solid rgba(76, 175, 80, 0.3)' : 'none',
                      }}
                    >
                      Team 1: {game.team1Player1Name} & {game.team1Player2Name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          game.winningTeam === 2 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                        p: 0.5,
                        border:
                          game.winningTeam === 2 ? '1px solid rgba(76, 175, 80, 0.3)' : 'none',
                      }}
                    >
                      Team 2: {game.team2Player1Name} & {game.team2Player2Name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="body2">
                      Score: {game.team1SetScore} - {game.team2SetScore}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Winner: {game.winningTeam > 0 ? `Team ${game.winningTeam}` : 'Tie'}
                    </Typography>
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
                  <TableCell>Date</TableCell>
                  <TableCell>Tournament</TableCell>
                  <TableCell>Team 1</TableCell>
                  <TableCell>Team 2</TableCell>
                  <TableCell>Set Score</TableCell>
                  <TableCell>Winner</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
                          game.winningTeam === 1 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                      }}
                    >
                      {game.team1Player1Name} <br /> {game.team1Player2Name}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor:
                          game.winningTeam === 2 ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                        borderRadius: 1,
                      }}
                    >
                      {game.team2Player1Name} <br /> {game.team2Player2Name}
                    </TableCell>
                    <TableCell>
                      {game.team1SetScore} - {game.team2SetScore}
                    </TableCell>
                    <TableCell>
                      {game.winningTeam > 0 ? `Team ${game.winningTeam}` : 'Tie'}
                    </TableCell>
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
      </Paper>

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
