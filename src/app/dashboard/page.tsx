import { Paper, Typography, Box } from '@mui/material';
import Layout from '@/components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to Padel Games! Here you can see an overview of your games, tournaments, and player statistics.
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}
