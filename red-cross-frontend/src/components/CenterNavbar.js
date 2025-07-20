import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function CenterNavbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button component={Link} to="/center" color="inherit" sx={{ fontWeight: 700 }}>Center Dashboard</Button>
                    <Button component={Link} to="/center/accepted-requests" color="inherit" sx={{ fontWeight: 700, ml: 2 }}>Accepted Requests</Button>
                    <Button component={Link} to="/center/canceled-requests" color="inherit" sx={{ fontWeight: 700, ml: 2 }}>Canceled Requests</Button>
                </Box>
                <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
} 