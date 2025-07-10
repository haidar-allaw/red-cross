// AdminLayout.jsx
import React from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PeopleIcon from '@mui/icons-material/People';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;
const RED = '#B71C1C';

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(o => !o);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      to: '/admin',
      description: 'Overview and statistics'
    },
    {
      label: 'Users',
      icon: <PeopleIcon />,
      to: '/admin/users',
      description: 'Manage user accounts',
      badge: 'New'
    },
    {
      label: 'Centers Approval',
      icon: <PendingActionsIcon />,
      to: '/admin/centers-approval',
      description: 'Approve medical centers'
    },
    {
      label: 'Blood Donations',
      icon: <BloodtypeIcon />,
      to: '/admin/blood-donations',
      description: 'View blood donations'
    }
  ];

  const drawer = (
    <Box sx={{
      height: '100%',
      background: 'linear-gradient(180deg, #B71C1C 0%, #d32f2f 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{
        p: 3,
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
        >
          <DashboardIcon sx={{ fontSize: 30 }} />
        </Avatar>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
          Red Cross Management
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ pt: 2 }}>
          {navItems.map(item => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 2,
                color: 'rgba(255,255,255,0.8)',
                '&.active': {
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.2)',
                  }
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon sx={{
                color: 'inherit',
                minWidth: 40
              }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="warning" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                />
                {item.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.75rem'
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{
        p: 2,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Red Cross Admin v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="primary"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ color: '#B71C1C', fontWeight: 600 }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#B71C1C', width: 35, height: 35 }}>
              <PeopleIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <IconButton color="error" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxShadow: '0 0 40px rgba(0,0,0,0.3)'
              }
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxShadow: '2px 0 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh'
        }}
      >
        <Toolbar /> {/* spacing for AppBar */}
        <Box sx={{ p: 3 }}>
          <Outlet />  {/* nested admin routes */}
        </Box>
      </Box>
    </Box>
  );
}
