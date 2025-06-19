// AdminHomePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

const API = 'http://localhost:4000/api';

export default function AdminHomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, centersRes, pendingRes] = await Promise.all([
        axios.get(`${API}/users/count`),
        axios.get(`${API}/centers/count`),
        axios.get(`${API}/centers/pendingCount`),
      ]);
      setStats({
        users: usersRes.data.count,
        centers: centersRes.data.count,
        pendingApprovals: pendingRes.data.count,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = stats
    ? [
        {
          label: 'Total Users',
          value: stats.users,
          icon: <PeopleIcon fontSize="large" />,
          color: theme.palette.success.main,
        },
        {
          label: 'Medical Centers',
          value: stats.centers,
          icon: <LocalHospitalIcon fontSize="large" />,
          color: theme.palette.info.main,
        },
        {
          label: 'Pending Approvals',
          value: stats.pendingApprovals,
          icon: <PendingActionsIcon fontSize="large" />,
          color: theme.palette.warning.main,
        },
      ]
    : [];

  return (
    <Box sx={{ p: isSmall ? 2 : 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: isSmall ? 2 : 4,
        }}
      >
       
        <IconButton onClick={fetchStats} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : <RefreshIcon />}
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          gap: isSmall ? 2 : 4,
          pb: 2,
        }}
      >
        {loading
          ? Array.from({ length: cards.length || 3 }).map((_, i) => (
              <Paper
                key={i}
                elevation={1}
                sx={{
                  flex: '0 0 250px',
                  height: 160,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                <CircularProgress />
              </Paper>
            ))
          : cards.map(({ label, value, icon, color }) => (
              <Paper
                key={label}
                elevation={4}
                sx={{
                  flex: '0 0 250px',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  },
                  bgcolor: color + '22',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: color,
                    width: 56,
                    height: 56,
                    mb: 1.5,
                  }}
                >
                  {icon}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {value}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {label}
                </Typography>
              </Paper>
            ))}
      </Box>
    </Box>
  );
}
