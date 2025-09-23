import { Paper, Typography, Box } from '@mui/material';
import Layout from '@/components/Layout';

export default function Games() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Games
          </Typography>
          <Typography variant="body1">
            Manage your padel games, schedule new matches, and view game results.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
