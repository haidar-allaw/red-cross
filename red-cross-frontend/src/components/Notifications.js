import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, CircularProgress, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { getTokenPayload } from '../utils/jwtUtils';

export default function Notifications() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Not authenticated');
            // The backend gets user from token, so just send token
            const { data } = await axios.get('http://localhost:4000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const clearAllNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete('http://localhost:4000/api/notifications/clear-all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications(); // Refresh notifications
        } catch (error) {
            console.error("Failed to clear all notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optionally, poll every minute:
        // const interval = setInterval(fetchNotifications, 60000);
        // return () => clearInterval(interval);
    }, []);

    const handleOpen = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {loading ? (
                    <MenuItem><CircularProgress size={20} /></MenuItem>
                ) : error ? (
                    <MenuItem disabled>{error}</MenuItem>
                ) : notifications.length === 0 ? (
                    <MenuItem disabled>No notifications</MenuItem>
                ) : (
                    <>
                        {notifications.map((notif) => (
                            <MenuItem key={notif._id} onClick={handleClose}>
                                <ListItemText
                                    primary={notif.message}
                                    secondary={new Date(notif.createdAt).toLocaleString()}
                                />
                            </MenuItem>
                        ))}
                        <MenuItem onClick={clearAllNotifications} style={{ color: '#b71c1c', fontWeight: 600 }}>
                            Clear All
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
} 