'use client';

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SETS } from '@/constants/constants';
import { SelectPlayer, SelectTournament } from '@/db/schema';

type AddGameDialogProps = {
  open: boolean;
  onClose: () => void;
  onGameAdded: () => void;
};

export default function AddGameDialog({ open, onClose, onGameAdded }: AddGameDialogProps) {
  const t = useTranslations('games');
  const [players, setPlayers] = useState<SelectPlayer[]>([]);
  const [tournaments, setTournaments] = useState<SelectTournament[]>([]);
  const [formData, setFormData] = useState({
    playedAt: new Date().toISOString().split('T')[0],
    team1PlayerDx: '',
    team1PlayerSx: '',
    team2PlayerDx: '',
    team2PlayerSx: '',
    team1Set1Score: '',
    team2Set1Score: '',
    team1Set2Score: '',
    team2Set2Score: '',
    team1Set3Score: '',
    team2Set3Score: '',
    tournamentId: '',
  });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      fetchPlayers();
      fetchTournaments();
    }
  }, [open]);

  // Calculate match results
  const getMatchResults = () => {
    let team1SetsScore = 0;
    let team2SetsScore = 0;

    if (formData.team1Set1Score > formData.team2Set1Score) {
      team1SetsScore++;
    } else if (formData.team1Set1Score < formData.team2Set1Score) {
      team2SetsScore++;
    }

    if (formData.team1Set2Score > formData.team2Set2Score) {
      team1SetsScore++;
    } else if (formData.team1Set2Score < formData.team2Set2Score) {
      team2SetsScore++;
    }

    if (formData.team1Set3Score > formData.team2Set3Score) {
      team1SetsScore++;
    } else if (formData.team1Set3Score < formData.team2Set3Score) {
      team2SetsScore++;
    }

    return { team1SetsScore, team2SetsScore };
  };

  const { team1SetsScore, team2SetsScore } = getMatchResults();

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/tournaments');
      if (!response.ok) throw new Error('Failed to fetch tournaments');
      const data = await response.json();
      setTournaments(data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          team1PlayerDx: parseInt(formData.team1PlayerDx),
          team1PlayerSx: parseInt(formData.team1PlayerSx),
          team2PlayerDx: parseInt(formData.team2PlayerDx),
          team2PlayerSx: parseInt(formData.team2PlayerSx),
          team1Set1Score: parseInt(formData.team1Set1Score),
          team2Set1Score: parseInt(formData.team2Set1Score),
          team1Set2Score: parseInt(formData.team1Set2Score),
          team2Set2Score: parseInt(formData.team2Set2Score),
          team1Set3Score: parseInt(formData.team1Set3Score),
          team2Set3Score: parseInt(formData.team2Set3Score),
          tournamentId: formData.tournamentId ? parseInt(formData.tournamentId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      setFormData({
        playedAt: new Date().toISOString().split('T')[0],
        team1PlayerDx: '',
        team1PlayerSx: '',
        team2PlayerDx: '',
        team2PlayerSx: '',
        team1Set1Score: '',
        team2Set1Score: '',
        team1Set2Score: '',
        team2Set2Score: '',
        team1Set3Score: '',
        team2Set3Score: '',
        tournamentId: '',
      });
      onGameAdded();
      onClose();
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game');
    } finally {
      setLoading(false);
    }
  };

  const getTeam1PlayersString = () => {
    const team1PlayerDx = players.find((p) => p.id.toString() === formData.team1PlayerDx);
    const team1PlayerSx = players.find((p) => p.id.toString() === formData.team1PlayerSx);
    if (!team1PlayerDx || !team1PlayerSx) return null;
    const team1Players = [
      `${team1PlayerDx?.lastName} ${team1PlayerDx?.firstName}`,
      `${team1PlayerSx?.lastName} ${team1PlayerSx?.firstName}`,
    ]
      .filter(Boolean)
      .join(' - ');
    return team1Players;
  };

  const getTeam2PlayersString = () => {
    const team2PlayerDx = players.find((p) => p.id.toString() === formData.team2PlayerDx);
    const team2PlayerSx = players.find((p) => p.id.toString() === formData.team2PlayerSx);
    if (!team2PlayerDx || !team2PlayerSx) return null;
    const team2Players = [
      `${team2PlayerDx?.lastName} ${team2PlayerDx?.firstName}`,
      `${team2PlayerSx?.lastName} ${team2PlayerSx?.firstName}`,
    ]
      .filter(Boolean)
      .join(' - ');
    return team2Players;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          {t('add_game')}
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 1,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label={t('add_edit_game.date_played')}
                type="date"
                required
                value={formData.playedAt}
                onChange={(e) => setFormData({ ...formData, playedAt: e.target.value })}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />

              <Autocomplete
                sx={{ flex: 1 }}
                options={tournaments}
                getOptionLabel={(option) => option.name}
                value={tournaments.find((t) => t.id.toString() === formData.tournamentId) || null}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, tournamentId: newValue?.id.toString() || '' })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('add_edit_game.tournament_optional')}
                    placeholder={t('add_edit_game.choose_tournament')}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                  {t('add_edit_game.team_1')}
                </Typography>
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerDx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.lastName} ${option.firstName}`}
                  value={players.find((p) => p.id.toString() === formData.team1PlayerDx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1PlayerDx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_dx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team2PlayerDx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.lastName} ${option.firstName}`}
                  value={players.find((p) => p.id.toString() === formData.team1PlayerSx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team1PlayerSx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_1_player_sx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                <Typography variant="h6" sx={{ mt: 2, flex: 1 }}>
                  {t('add_edit_game.team_2')}
                </Typography>
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerSx
                  )}
                  getOptionLabel={(option) => `${option.lastName} ${option.firstName}`}
                  value={players.find((p) => p.id.toString() === formData.team2PlayerDx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2PlayerDx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_dx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
                <Autocomplete
                  options={players.filter(
                    (p) =>
                      p.id.toString() !== formData.team1PlayerDx &&
                      p.id.toString() !== formData.team1PlayerSx &&
                      p.id.toString() !== formData.team2PlayerDx
                  )}
                  getOptionLabel={(option) => `${option.lastName} ${option.firstName}`}
                  value={players.find((p) => p.id.toString() === formData.team2PlayerSx) || null}
                  onChange={(_, newValue) =>
                    setFormData({ ...formData, team2PlayerSx: newValue?.id.toString() || '' })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('add_edit_game.team_2_player_sx')}
                      placeholder={t('add_edit_game.choose_player')}
                      required
                    />
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Box>
            </Box>

            <Typography variant="h6">{t('add_edit_game.score')}</Typography>
            <Typography sx={{ px: { xs: 1, md: 2 } }}>
              {t('add_edit_game.team_1')}
              {getTeam1PlayersString() && `: ${getTeam1PlayersString()}`}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: { xs: '100%', md: '50%' },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 1, md: 2 },
                }}
              >
                <Typography sx={{ width: '70px', fontWeight: 'bold', textAlign: 'center' }}>
                  {team1SetsScore}
                </Typography>
                {
                  <>
                    {SETS.map((set) => (
                      <TextField
                        key={`team1-set${set}`}
                        sx={{ width: '50px' }}
                        type="number"
                        slotProps={{ htmlInput: { min: 0 } }}
                        value={formData[`team1Set${set}Score`]}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            [`team1Set${set}Score`]: e.target.value,
                          });
                        }}
                      />
                    ))}
                  </>
                }
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'grey.200',
                  borderRadius: '4px',
                  px: { xs: 1, md: 2 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    width: '70px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('add_edit_game.result')}
                </Typography>
                {
                  <>
                    {SETS.map((set) => (
                      <Typography
                        variant="body2"
                        key={`team1-set${set}-header`}
                        sx={{ width: '50px', textAlign: 'center' }}
                      >
                        SET {set}
                      </Typography>
                    ))}
                  </>
                }
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: { xs: 1, md: 2 },
                }}
              >
                <Typography sx={{ width: '70px', fontWeight: 'bold', textAlign: 'center' }}>
                  {team2SetsScore}
                </Typography>
                {
                  <>
                    {SETS.map((set) => (
                      <TextField
                        key={`team2-set${set}`}
                        sx={{ width: '50px' }}
                        type="number"
                        slotProps={{ htmlInput: { min: 0 } }}
                        value={formData[`team2Set${set}Score`]}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            [`team2Set${set}Score`]: e.target.value,
                          });
                        }}
                      />
                    ))}
                  </>
                }
              </Box>
            </Box>
            <Typography sx={{ px: { xs: 1, md: 2 } }}>
              {t('add_edit_game.team_2')}
              {getTeam2PlayersString() && `: ${getTeam2PlayersString()}`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button onClick={onClose} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('adding') : t('add_game')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
