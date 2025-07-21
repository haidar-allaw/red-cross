import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, CircularProgress, Alert, Chip } from '@mui/material';
import { CalendarToday, AccessTime, Person, Bloodtype, DoneAll } from '@mui/icons-material';
import axios from 'axios';
import { getTokenPayload } from '../../utils/jwtUtils';

export default function CenterCompletedDonations() {
    const [completedDonations, setCompletedDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Not authenticated');
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) throw new Error('Invalid token');
                const centerId = payload.id;
                const { data } = await axios.get(`http://localhost:4000/api/blood/center/${centerId}`);
                // Filter for completed donations
                const completed = data.filter(d => d.status === 'completed');
                setCompletedDonations(completed);
            } catch (err) {
                setError('Failed to load completed donations');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box sx={{ minHeight: '80vh', p: 3, background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)' }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#2e7d32', fontWeight: 700 }}>
                Completed Donations
            </Typography>
            {completedDonations.length === 0 ? (
                <Alert severity="info">No completed donations found.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {completedDonations.map((request) => (
                        <Grid item xs={12} key={request._id}>
                            <Card sx={{ border: '1px solid #c8e6c9', borderRadius: 3 }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#2196F3', width: 32, height: 32, mr: 1 }}>
                                                    <Person />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {request.user?.firstname && request.user?.lastname
                                                        ? `${request.user.firstname} ${request.user.lastname}`
                                                        : 'User Information Not Available'}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.user?.email || 'Email not available'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#B71C1C', width: 32, height: 32, mr: 1 }}>
                                                    <Bloodtype />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {request.bloodtype}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.units} units
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#4CAF50', width: 32, height: 32, mr: 1 }}>
                                                    <CalendarToday />
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {new Date(request.timestamp).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ bgcolor: '#FF9800', width: 32, height: 32, mr: 1 }}>
                                                    <AccessTime />
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {new Date(request.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Chip
                                                icon={<DoneAll />}
                                                label={request.status}
                                                sx={{
                                                    bgcolor: '#4caf50',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
} 