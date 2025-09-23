import { Paper, Typography, Box } from '@mui/material';
import Layout from '@/components/Layout';

export default function Tournaments() {
  return (
    <Layout>
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
    </Layout>
  );
}
