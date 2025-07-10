// // AdminHomePage.jsx
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Avatar,
//   IconButton,
//   CircularProgress,
//   useTheme,
//   useMediaQuery,
//   Grid,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar,
//   Button
// } from '@mui/material';
// import {
//   PeopleIcon,
//   LocalHospitalIcon,
//   PendingActionsIcon,
//   RefreshIcon,
//   TrendingUpIcon,
//   BloodtypeIcon,
//   NotificationsIcon,
//   CalendarTodayIcon
// } from '@mui/icons-material';
// import axios from 'axios';

// const API = 'http://localhost:4000/api';

// export default function AdminHomePage() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const theme = useTheme();
//   const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

//   const fetchStats = async () => {
//     setLoading(true);
//     try {
//       const [usersRes, centersRes, pendingRes] = await Promise.all([
//         axios.get(`${API}/users/count`),
//         axios.get(`${API}/centers/count`),
//         axios.get(`${API}/centers/pendingCount`),
//       ]);
//       setStats({
//         users: usersRes.data.count,
//         centers: centersRes.data.count,
//         pendingApprovals: pendingRes.data.count,
//       });
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const statCards = stats
//     ? [
//         {
//           label: 'Total Users',
//           value: stats.users,
//           icon: <PeopleIcon />,
//           color: '#2196F3',
//           gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
//           change: '+12%',
//           changeType: 'positive'
//         },
//         {
//           label: 'Medical Centers',
//           value: stats.centers,
//           icon: <LocalHospitalIcon />,
//           color: '#4CAF50',
//           gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
//           change: '+5%',
//           changeType: 'positive'
//         },
//         {
//           label: 'Pending Approvals',
//           value: stats.pendingApprovals,
//           icon: <PendingActionsIcon />,
//           color: '#FF9800',
//           gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
//           change: '-3%',
//           changeType: 'negative'
//         },
//         {
//           label: 'Blood Donations',
//           value: '156',
//           icon: <BloodtypeIcon />,
//           color: '#B71C1C',
//           gradient: 'linear-gradient(135deg, #B71C1C 0%, #d32f2f 100%)',
//           change: '+23%',
//           changeType: 'positive'
//         }
//       ]
//     : [];

//   const recentActivities = [
//     { id: 1, action: 'New user registered', time: '2 minutes ago', type: 'user' },
//     { id: 2, action: 'Blood donation recorded', time: '15 minutes ago', type: 'donation' },
//     { id: 3, action: 'Medical center approved', time: '1 hour ago', type: 'center' },
//     { id: 4, action: 'New blood request', time: '2 hours ago', type: 'request' },
//     { id: 5, action: 'User profile updated', time: '3 hours ago', type: 'user' }
//   ];

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'user': return <PeopleIcon />;
//       case 'donation': return <BloodtypeIcon />;
//       case 'center': return <LocalHospitalIcon />;
//       case 'request': return <NotificationsIcon />;
//       default: return <CalendarTodayIcon />;
//     }
//   };

//   const getActivityColor = (type) => {
//     switch (type) {
//       case 'user': return '#2196F3';
//       case 'donation': return '#B71C1C';
//       case 'center': return '#4CAF50';
//       case 'request': return '#FF9800';
//       default: return '#757575';
//     }
//   };

//   return (
//     <Box sx={{ p: isSmall ? 2 : 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, color: '#B71C1C', mb: 1 }}>
//               Welcome back, Admin!
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Here's what's happening with your Red Cross system today
//             </Typography>
//           </Box>
//           <Button
//             variant="outlined"
//             startIcon={<RefreshIcon />}
//             onClick={fetchStats}
//             disabled={loading}
//             sx={{ borderRadius: 2 }}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {loading
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <Grid item xs={12} sm={6} md={3} key={i}>
//                 <Card sx={{ borderRadius: 3, height: 160 }}>
//                   <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
//                     <CircularProgress />
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))
//           : statCards.map((card) => (
//               <Grid item xs={12} sm={6} md={3} key={card.label}>
//                 <Card
//                   sx={{
//                     borderRadius: 3,
//                     background: card.gradient,
//                     color: 'white',
//                     height: 160,
//                     transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//                     '&:hover': {
//                       transform: 'translateY(-8px)',
//                       boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
//                     }
//                   }}
//                 >
//                   <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <Avatar
//                         sx={{
//                           bgcolor: 'rgba(255,255,255,0.2)',
//                           width: 50,
//                           height: 50
//                         }}
//                       >
//                         {card.icon}
//                       </Avatar>
//                       <Chip
//                         label={card.change}
//                         size="small"
//                         sx={{
//                           bgcolor: card.changeType === 'positive' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
//                           color: 'white',
//                           fontWeight: 600
//                         }}
//                       />
//                     </Box>
//                     <Box>
//                       <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
//                         {card.value}
//                       </Typography>
//                       <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                         {card.label}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//       </Grid>

//       {/* Content Grid */}
//       <Grid container spacing={3}>
//         {/* Quick Actions */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ borderRadius: 3, height: 'fit-content' }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#B71C1C' }}>
//                 Quick Actions
//               </Typography>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<PeopleIcon />}
//                   sx={{
//                     bgcolor: '#2196F3',
//                     borderRadius: 2,
//                     py: 1.5,
//                     '&:hover': { bgcolor: '#1976D2' }
//                   }}
//                 >
//                   Manage Users
//                 </Button>
//                 <Button
//                   variant="contained"
//                   startIcon={<LocalHospitalIcon />}
//                   sx={{
//                     bgcolor: '#4CAF50',
//                     borderRadius: 2,
//                     py: 1.5,
//                     '&:hover': { bgcolor: '#388E3C' }
//                   }}
//                 >
//                   Approve Centers
//                 </Button>
//                 <Button
//                   variant="contained"
//                   startIcon={<BloodtypeIcon />}
//                   sx={{
//                     bgcolor: '#B71C1C',
//                     borderRadius: 2,
//                     py: 1.5,
//                     '&:hover': { bgcolor: '#d32f2f' }
//                   }}
//                 >
//                   View Donations
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Recent Activity */}
//         <Grid item xs={12} md={8}>
//           <Card sx={{ borderRadius: 3 }}>
//             <CardContent>
//               <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#B71C1C' }}>
//                 Recent Activity
//               </Typography>
//               <List>
//                 {recentActivities.map((activity, index) => (
//                   <React.Fragment key={activity.id}>
//                     <ListItem sx={{ px: 0 }}>
//                       <ListItemAvatar>
//                         <Avatar sx={{ bgcolor: getActivityColor(activity.type), width: 35, height: 35 }}>
//                           {getActivityIcon(activity.type)}
//                         </Avatar>
//                       </ListItemAvatar>
//                       <ListItemText
//                         primary={activity.action}
//                         secondary={activity.time}
//                         primaryTypographyProps={{ fontWeight: 500 }}
//                         secondaryTypographyProps={{ fontSize: '0.875rem' }}
//                       />
//                     </ListItem>
//                     {index < recentActivities.length - 1 && (
//                       <Divider variant="inset" component="li" />
//                     )}
//                   </React.Fragment>
//                 ))}
//               </List>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }
