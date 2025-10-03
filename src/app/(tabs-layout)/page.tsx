'use client';

import { Box, Divider, Paper, Typography } from '@mui/material';
import { Gauge } from '@mui/x-charts/Gauge';
import Link from 'next/link';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import Loading from '../loading';

export default function Dashboard() {
  const { user, isChecking } = useProtectedRoute();

  if (isChecking) return <Loading />;

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to Padel Games!{' '}
            <Link href="/handler/sign-in" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Login
            </Link>{' '}
            to see your dashboard.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to Padel Games {user?.displayName || user?.primaryEmail?.split('@')[0]}! Here you
          can see statistics of your games.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="body1">Percentage of wins in games played last month</Typography>
            <Gauge value={60} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="body1">
              Percentage of wins in games played last month against selected player
            </Typography>
            <Gauge value={60} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
