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
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button
} from '@mui/material';
import RefreshIcon         from '@mui/icons-material/Refresh';
import LocalHospitalIcon   from '@mui/icons-material/LocalHospital';
import PendingActionsIcon  from '@mui/icons-material/PendingActions';
import TrendingUpIcon      from '@mui/icons-material/TrendingUp';
import BloodtypeIcon       from '@mui/icons-material/Bloodtype';
import NotificationsIcon   from '@mui/icons-material/Notifications';
import CalendarTodayIcon   from '@mui/icons-material/CalendarToday';
import PeopleIcon          from '@mui/icons-material/People';
import axios from 'axios';
import RedCrossIcon from '../../assets/redCrossIcon.png'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:4000/api';

export default function AdminHomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState({ users: 0, centers: 0, pendingApprovals: 0, donations: 0 });
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  // Animated count-up effect for stats
  useEffect(() => {
    if (!stats) return;
    const keys = ['users', 'centers', 'pendingApprovals', 'donations'];
    const intervals = {};
    keys.forEach((key) => {
      let start = 0;
      let end = stats[key] || 0;
      if (typeof end !== 'number') end = parseInt(end) || 0;
      const step = Math.ceil(end / 30) || 1;
      intervals[key] = setInterval(() => {
        setAnimateStats((prev) => {
          const next = { ...prev };
          if (next[key] < end) {
            next[key] = Math.min(next[key] + step, end);
          }
          return next;
        });
      }, 20);
    });
    return () => keys.forEach((key) => clearInterval(intervals[key]));
  }, [stats]);

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
        donations: 156 // Placeholder, replace with real API if available
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

  const statCards = stats
    ? [
        {
          label: 'Total Users',
          value: animateStats.users,
          icon: <PeopleIcon fontSize="large" />,
          color: '#2196F3',
          gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
          change: '+12%',
          changeType: 'positive',
        },
        {
          label: 'Medical Centers',
          value: animateStats.centers,
          icon: <LocalHospitalIcon fontSize="large" />,
          color: '#4CAF50',
          gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          change: '+5%',
          changeType: 'positive',
        },
        {
          label: 'Pending Approvals',
          value: animateStats.pendingApprovals,
          icon: <PendingActionsIcon fontSize="large" />,
          color: '#FF9800',
          gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
          change: '-3%',
          changeType: 'negative',
        },
        {
          label: 'Blood Donations',
          value: animateStats.donations,
          icon: <BloodtypeIcon fontSize="large" />,
          color: '#B71C1C',
          gradient: 'linear-gradient(135deg, #B71C1C 0%, #d32f2f 100%)',
          change: '+23%',
          changeType: 'positive',
        },
      ]
    : [];

  const recentActivities = [
    { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Blood donation recorded', time: '15 minutes ago', type: 'donation' },
    { id: 3, action: 'Medical center approved', time: '1 hour ago', type: 'center' },
    { id: 4, action: 'New blood request', time: '2 hours ago', type: 'request' },
    { id: 5, action: 'User profile updated', time: '3 hours ago', type: 'user' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <PeopleIcon />;
      case 'donation': return <BloodtypeIcon />;
      case 'center': return <LocalHospitalIcon />;
      case 'request': return <NotificationsIcon />;
      default: return <CalendarTodayIcon />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user': return '#2196F3';
      case 'donation': return '#B71C1C';
      case 'center': return '#4CAF50';
      case 'request': return '#FF9800';
      default: return '#757575';
    }
  };

  return (
    <Box
      sx={{
        p: isSmall ? 1 : 3,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)',
      }}
    >
      {/* Header with logo/avatar */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={RedCrossIcon} sx={{ width: 56, height: 56, bgcolor: '#fff', boxShadow: 2, mr: 2 }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#B71C1C', mb: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
                Welcome back, Admin!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Here's what's happening with your Red Cross system today
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStats}
            disabled={loading}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ borderRadius: 4, height: 170, boxShadow: 3, background: '#f5f5f5' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <CircularProgress />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : statCards.map((card) => (
              <Grid item xs={12} sm={6} md={3} key={card.label}>
                <Card
                  sx={{
                    borderRadius: 4,
                    background: card.gradient,
                    color: 'white',
                    height: 170,
                    boxShadow: '0 8px 32px rgba(183,28,28,0.12)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 20px 40px rgba(183,28,28,0.18)',
                    },
                  }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.18)',
                          width: 56,
                          height: 56,
                          boxShadow: 2,
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Chip
                        label={card.change}
                        size="small"
                        sx={{
                          bgcolor: card.changeType === 'positive' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: 16,
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                        {card.label}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, height: 'fit-content', boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#B71C1C', fontFamily: 'Montserrat, sans-serif' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  sx={{
                    bgcolor: '#2196F3',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 16,
                    '&:hover': { bgcolor: '#1976D2' },
                  }}
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users
                </Button>
                <Button
                  variant="contained"
                  startIcon={<LocalHospitalIcon />}
                  sx={{
                    bgcolor: '#4CAF50',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 16,
                    '&:hover': { bgcolor: '#388E3C' },
                  }}
                  onClick={() => navigate('/admin/centers-approval')}
                >
                  Approve Centers
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BloodtypeIcon />}
                  sx={{
                    bgcolor: '#B71C1C',
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 16,
                    '&:hover': { bgcolor: '#d32f2f' },
                  }}
                  onClick={() => navigate('/admin/blood-donations')}
                >
                  View Donations
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#B71C1C', fontFamily: 'Montserrat, sans-serif' }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getActivityColor(activity.type), width: 40, height: 40, boxShadow: 1 }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.time}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: 17 }}
                        secondaryTypographyProps={{ fontSize: '0.95rem' }}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
