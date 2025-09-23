'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  Dashboard,
  SportsBaseball,
  People,
  EmojiEvents,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Padel Games
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="navigation tabs">
            <Tab 
              icon={<Dashboard />} 
              label="Dashboard" 
              id="nav-tab-0"
              aria-controls="nav-tabpanel-0"
            />
            <Tab 
              icon={<SportsBaseball />} 
              label="Games" 
              id="nav-tab-1"
              aria-controls="nav-tabpanel-1"
            />
            <Tab 
              icon={<People />} 
              label="Players" 
              id="nav-tab-2"
              aria-controls="nav-tabpanel-2"
            />
            <Tab 
              icon={<EmojiEvents />} 
              label="Tournaments" 
              id="nav-tab-3"
              aria-controls="nav-tabpanel-3"
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome to Padel Games! Here you can see an overview of your games, tournaments, and player statistics.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Games
            </Typography>
            <Typography variant="body1">
              Manage your padel games, schedule new matches, and view game results.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Players
            </Typography>
            <Typography variant="body1">
              View and manage player profiles, statistics, and rankings.
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Tournaments
            </Typography>
            <Typography variant="body1">
              Create and manage tournaments, view brackets, and track tournament progress.
            </Typography>
          </Paper>
        </TabPanel>
      </Container>
    </Box>
  );
}
