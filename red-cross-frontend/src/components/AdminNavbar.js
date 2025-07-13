import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
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
                    <Button component={Link} to="/admin" color="inherit" sx={{ fontWeight: 700 }}>Admin Dashboard</Button>
                    <Button component={Link} to="/admin/users" color="inherit">User Management</Button>
                    <Button component={Link} to="/admin/blood-donations" color="inherit">Blood Donations</Button>
                    <Button component={Link} to="/admin/centers-approval" color="inherit">Centers Approval</Button>
                </Box>
                <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
} 