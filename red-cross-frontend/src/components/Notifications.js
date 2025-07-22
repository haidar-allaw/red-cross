// src/components/Notifications.jsx

import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
  Typography
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { getTokenPayload } from '../utils/jwtUtils';

export default function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  const apiBase = 'http://localhost:4000/api';

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      // decode JWT to extract the user ID
      const { id: userId } = getTokenPayload(token);
      if (!userId) throw new Error('Invalid token payload');

      // GET /api/notifications?userId=...
      const { data } = await axios.get(
        `${apiBase}/notifications?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');

      const { id: userId } = getTokenPayload(token);
      if (!userId) throw new Error('Invalid token payload');

      // DELETE /api/notifications/clear-all?userId=...
      await axios.delete(
        `${apiBase}/notifications/clear-all?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh list
      fetchNotifications();
    } catch (err) {
      console.error('Failed to clear all notifications', err);
      // you can optionally setError here
    }
  };

  useEffect(() => {
    fetchNotifications();
    // If you want polling:
    // const id = setInterval(fetchNotifications, 60000);
    // return () => clearInterval(id);
  }, []);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { minWidth: 300 } }}
      >
        {loading ? (
          <MenuItem>
            <CircularProgress size={24} />
            <Typography variant="body2" style={{ marginLeft: 8 }}>
              Loading…
            </Typography>
          </MenuItem>
        ) : error ? (
          <MenuItem disabled>
            <Typography color="error">{error}</Typography>
          </MenuItem>
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

            <MenuItem
              onClick={() => {
                clearAllNotifications();
                handleClose();
              }}
              style={{ color: '#b71c1c', fontWeight: 600 }}
            >
              Clear All
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
