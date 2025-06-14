import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Donate Blood', to: '/donate-blood' },
    { label: 'Our Work', to: '/our-work' },
    { label: 'Volunteer', to: '/volunteer' },
    { label: 'Resources', to: '/resources' },
    { label: 'Contact', to: '/contact' },
    { label: 'Find Hospitals', to: '/hospitals' },
];

export default function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawer = (
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
                {navLinks.map((item) => (
                    <ListItem key={item.to} disablePadding>
                        <ListItemButton component={RouterLink} to={item.to}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/donate">
                        <Button variant="contained" color="primary" fullWidth sx={{ mt: 1, fontWeight: 700 }}>
                            Donate
                        </Button>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" elevation={3} sx={{ background: 'rgba(255,255,255,0.95)', color: '#222', backdropFilter: 'blur(8px)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 72 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img src="/redCrossIcon.png" alt="Red Cross Logo" style={{ height: 40, marginRight: 12 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#d32f2f' }}>
                            Red Cross
                        </Typography>
                    </RouterLink>
                </Box>
                {isMobile ? (
                    <>
                        <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                            <MenuIcon fontSize="large" />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                            {drawer}
                        </Drawer>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {navLinks.map((item) => (
                            <Button
                                key={item.to}
                                component={RouterLink}
                                to={item.to}
                                color="inherit"
                                sx={{ fontWeight: 600, fontSize: 16, textTransform: 'none', px: 2 }}
                            >
                                {item.label}
                            </Button>
                        ))}
                        <Button
                            component={RouterLink}
                            to="/donate"
                            variant="contained"
                            color="primary"
                            sx={{ ml: 2, fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(211,47,47,0.12)' }}
                        >
                            Donate
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}