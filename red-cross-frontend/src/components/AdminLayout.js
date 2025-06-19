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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { NavLink, Outlet } from 'react-router-dom';

const drawerWidth = 240;
const RED = '#B71C1C';

export default function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(o => !o);

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, to: '/admin' },
    { label: 'Centers Approval', icon: <PendingActionsIcon />, to: '/admin/centers-approval' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: RED }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: '#b71c1c88' }} />
      <List>
        {navItems.map(item => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={() => isMobile && setMobileOpen(false)}
            sx={{
              color: '#fff',
              '&.active': {
                bgcolor: '#880e0e',
              },
              '&:hover': {
                bgcolor: '#880e0e',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          bgcolor: RED,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
        elevation={1}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

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
                bgcolor: RED,
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
                bgcolor: RED,
              }
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar /> {/* spacing for AppBar */}
        <Outlet />  {/* nested admin routes */}
      </Box>
    </Box>
  );
}
