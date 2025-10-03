import { Box, Paper, Typography } from '@mui/material';
import Loading from '@/app/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function Tournaments() {
  const { isChecking } = useProtectedRoute();

  if (isChecking) return <Loading />;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Tournaments
        </Typography>
        <Typography variant="body1">
          Create and manage tournaments, view brackets, and track tournament progress.
        </Typography>
      </Paper>
    </Box>
  );
}
