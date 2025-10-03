import { Box, Paper, Typography } from '@mui/material';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loading from '../loading';

export default function Dashboard() {
  const { isChecking } = useProtectedRoute();

  if (isChecking) return <Loading />;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to Padel Games! Here you can see an overview of your games, tournaments, and
          player statistics.
        </Typography>
      </Paper>
    </Box>
  );
}
