import { Box, Paper, Typography } from '@mui/material';

export default function Dashboard() {
  //TODO: add check if the user is authenticated to display the page (see games page)
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
