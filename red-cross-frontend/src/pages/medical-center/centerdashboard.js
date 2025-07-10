import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Grid, Avatar, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function CenterDashboard() {
    const [centerInfo, setCenterInfo] = useState(null);
    const [availableBlood, setAvailableBlood] = useState([]);
    const [neededBlood, setNeededBlood] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        </Box>
    );
} 