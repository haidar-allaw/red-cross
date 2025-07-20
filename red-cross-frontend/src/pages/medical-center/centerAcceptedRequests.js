import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, CircularProgress, Alert, Chip } from '@mui/material';
import { AccessTime, Person, Bloodtype } from '@mui/icons-material';
import axios from 'axios';
import { getTokenPayload } from '../../utils/jwtUtils';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function CenterAcceptedRequests() {
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogRequestId, setDialogRequestId] = useState(null);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogConfirmText, setDialogConfirmText] = useState('Confirm');

    useEffect(() => {
        const fetchAcceptedRequests = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Not authenticated');
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) throw new Error('Invalid token');
                const centerId = payload.id;
                const { data } = await axios.get(`http://localhost:4000/api/bloodRequests/center/${centerId}`);
                setAcceptedRequests(data.filter(req => req.status === 'Approved'));
            } catch (err) {
                setError('Failed to load accepted requests');
            } finally {
                setLoading(false);
            }
        };
        fetchAcceptedRequests();
    }, []);

    const openDeleteDialog = (id) => {
        setDialogRequestId(id);
        setDialogTitle('Delete Blood Request');
        setDialogContent('Are you sure you want to delete this blood request? This action cannot be undone.');
        setDialogConfirmText('Delete');
        setDialogOpen(true);
    };
    const closeDialog = () => {
        setDialogOpen(false);
        setDialogRequestId(null);
    };
    const handleDialogConfirm = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/bloodRequests/${dialogRequestId}`);
            setAcceptedRequests((prev) => prev.filter((req) => req._id !== dialogRequestId));
        } catch (err) {
            setError('Failed to delete the request.');
        }
        closeDialog();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box sx={{ minHeight: '80vh', p: 3, background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)' }}>
            <Typography variant="h4" sx={{ mb: 4, color: '#4caf50', fontWeight: 700 }}>
                Accepted Blood Requests
            </Typography>
            {acceptedRequests.length === 0 ? (
                <Alert severity="info">No accepted blood requests at the moment.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {acceptedRequests.map((request) => (
                        <Grid item xs={12} key={request._id}>
                            <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 3, position: 'relative' }}>
                                <IconButton
                                    size="small"
                                    aria-label="delete"
                                    onClick={() => openDeleteDialog(request._id)}
                                    sx={{
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        zIndex: 2,
                                        bgcolor: 'rgba(255,255,255,0.8)',
                                        '&:hover': { bgcolor: '#f44336', color: 'white' },
                                        boxShadow: 1
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#9C27B0', width: 32, height: 32, mr: 1 }}>
                                                    <Person />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {request.requestType === 'Individual' ? request.patientName : request.hospitalName}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.requestType}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.userEmail || 'No email available'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.contactPhone}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#B71C1C', width: 32, height: 32, mr: 1 }}>
                                                    <Bloodtype />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {request.bloodType}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.unitsNeeded} units needed
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Chip
                                                label={request.urgency}
                                                sx={{
                                                    bgcolor: request.urgency === 'Emergency' ? '#f44336' :
                                                        request.urgency === 'Urgent' ? '#ff9800' : '#4caf50',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Chip
                                                label={request.status}
                                                sx={{
                                                    bgcolor: '#4caf50',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Avatar sx={{ bgcolor: '#FF9800', width: 32, height: 32, mr: 1 }}>
                                                    <AccessTime />
                                                </Avatar>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {new Date(request.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(request.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <ConfirmDialog
                open={dialogOpen}
                title={dialogTitle}
                content={dialogContent}
                onClose={(confirmed) => { if (confirmed) handleDialogConfirm(); else closeDialog(); }}
                confirmText={dialogConfirmText}
            />
        </Box>
    );
} 