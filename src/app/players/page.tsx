import { Paper, Typography, Box } from '@mui/material';
import Layout from '@/components/Layout';

export default function Players() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Players
          </Typography>
          <Typography variant="body1">
            View and manage player profiles, statistics, and rankings.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
