import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Grid, Avatar, CircularProgress, Alert, Card, CardContent, Divider, Chip } from '@mui/material';
import { CalendarToday, AccessTime, Person, Bloodtype } from '@mui/icons-material';
import axios from 'axios';

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function CenterDashboard() {
    const [centerInfo, setCenterInfo] = useState(null);
    const [availableBlood, setAvailableBlood] = useState([]);
    const [neededBlood, setNeededBlood] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    // Get center ID from token
    useEffect(() => {
        const fetchCenter = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Not authenticated');
                // Decode token to get center id
                const payload = JSON.parse(atob(token.split('.')[1]));
                const centerId = payload.id;
                const { data } = await axios.get(`http://localhost:4000/api/centers/${centerId}`);
                setCenterInfo(data);
                setAvailableBlood(data.availableBloodTypes || []);
                setNeededBlood(data.neededBloodTypes || []);

                // Fetch donation requests for this center
                const { data: requests } = await axios.get(`http://localhost:4000/api/blood/center/${centerId}`);
                console.log('Donation requests received:', requests);
                setDonationRequests(requests.filter(req => req.status === 'scheduled'));
            } catch (err) {
                setError('Failed to load center info');
            } finally {
                setLoading(false);
            }
        };
        fetchCenter();
    }, []);

    const handleAvailableChange = (e) => {
        setAvailableBlood(e.target.value);
    };
    const handleNeededChange = (e) => {
        setNeededBlood(e.target.value);
    };

    const handleSave = async () => {
        if (!centerInfo) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            const payload = JSON.parse(atob(token.split('.')[1]));
            const centerId = payload.id;
            await axios.patch(
                `http://localhost:4000/api/centers/${centerId}`,
                {
                    availableBloodTypes: availableBlood,
                    neededBloodTypes: neededBlood
                }
            );
            setSuccess('Changes saved!');
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Cancel donation request handler
    const handleCancelRequest = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this donation request?')) return;
        setDeletingId(id);
        try {
            await axios.delete(`http://localhost:4000/api/blood/${id}`);
            setDonationRequests((prev) => prev.filter((req) => req._id !== id));
        } catch (err) {
            alert('Failed to cancel the request.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><Alert severity="error">{error}</Alert></Box>;
    if (!centerInfo) return null;

    return (
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa', p: 2 }}>
            <Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
                <Typography variant="h4" sx={{ mb: 2, color: '#B71C1C', fontWeight: 700 }}>
                    Medical Center Dashboard
                </Typography>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Center Info</Typography>
                        <Typography>Name: {centerInfo.name}</Typography>
                        <Typography>Email: {centerInfo.email}</Typography>
                        <Typography>Address: {centerInfo.address}</Typography>
                        {centerInfo.hospitalCardImage && (
                            <Box mt={2}>
                                <Typography variant="subtitle2">Hospital Card:</Typography>
                                <Avatar src={`http://localhost:4000/${centerInfo.hospitalCardImage}`} variant="rounded" sx={{ width: 120, height: 120 }} />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Available Blood Types"
                            value={availableBlood}
                            onChange={handleAvailableChange}
                            SelectProps={{ multiple: true }}
                            fullWidth
                            helperText="Select all blood types you currently have"
                        >
                            {bloodTypes.map(bt => (
                                <MenuItem key={bt} value={bt}>{bt}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Needed Blood Types"
                            value={neededBlood}
                            onChange={handleNeededChange}
                            SelectProps={{ multiple: true }}
                            fullWidth
                            helperText="Select all blood types you need"
                        >
                            {bloodTypes.map(bt => (
                                <MenuItem key={bt} value={bt}>{bt}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave} disabled={saving}>
                            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Donation Requests Section */}
            <Paper sx={{ p: 4, maxWidth: 800, width: '100%', mt: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, color: '#B71C1C', fontWeight: 700 }}>
                    Scheduled Donation Requests
                </Typography>

                {donationRequests.length === 0 ? (
                    <Alert severity="info">No scheduled donation requests at the moment.</Alert>
                ) : (
                    <Grid container spacing={2}>
                        {donationRequests.map((request) => (
                            <Grid item xs={12} key={request._id}>
                                <Card sx={{
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} md={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Person sx={{ color: '#B71C1C', mr: 1 }} />
                                                    <Typography variant="h6">
                                                        {request.user?.firstname && request.user?.lastname
                                                            ? `${request.user.firstname} ${request.user.lastname}`
                                                            : 'User Information Not Available'
                                                        }
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.user?.email || 'Email not available'}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.user?.phoneNumber || 'Phone not available'}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} md={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Bloodtype sx={{ color: '#B71C1C', mr: 1 }} />
                                                    <Typography variant="h6">
                                                        {request.bloodtype}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {request.units} units
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} md={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <CalendarToday sx={{ color: '#B71C1C', mr: 1 }} />
                                                    <Typography variant="body1">
                                                        {new Date(request.timestamp).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AccessTime sx={{ color: '#B71C1C', mr: 1 }} />
                                                    <Typography variant="body1">
                                                        {new Date(request.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} md={2}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: request.status === 'scheduled' ? '#1976d2' : '#666',
                                                        textTransform: 'capitalize'
                                                    }}
                                                >
                                                    {request.status}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} md={2}>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        sx={{ bgcolor: '#4caf50' }}
                                                        onClick={() => console.log('Complete clicked')}
                                                    >
                                                        Complete
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleCancelRequest(request._id)}
                                                        disabled={deletingId === request._id}
                                                    >
                                                        {deletingId === request._id ? 'Cancelling...' : 'Cancel'}
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
} 