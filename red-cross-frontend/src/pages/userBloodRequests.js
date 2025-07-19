import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
    Grid,
    Avatar,
    Divider
} from '@mui/material';
import {
    Bloodtype,
    Person,
    AccessTime,
    CheckCircle,
    Cancel,
    Pending,
    LocalHospital
} from '@mui/icons-material';
import axios from 'axios';
import { getTokenPayload } from '../utils/jwtUtils';

export default function UserBloodRequests() {
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserBloodRequests = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Please login to view your blood requests');
                    setLoading(false);
                    return;
                }

                const payload = getTokenPayload(token);
                if (!payload || !payload.id) {
                    setError('Invalid token - user ID not found');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.get(`http://localhost:4000/api/bloodRequests/user/${payload.id}`);
                setBloodRequests(data);
            } catch (err) {
                console.error('Error fetching blood requests:', err);
                setError('Failed to load blood requests');
            } finally {
                setLoading(false);
            }
        };

        fetchUserBloodRequests();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'success';
            case 'Rejected':
                return 'error';
            case 'Completed':
                return 'info';
            default:
                return 'warning';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle />;
            case 'Rejected':
                return <Cancel />;
            case 'Completed':
                return <CheckCircle />;
            default:
                return <Pending />;
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)'
            }}>
                <CircularProgress size={60} sx={{ color: '#B71C1C' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)'
            }}>
                <Alert severity="error" sx={{ fontSize: 18, p: 3 }}>{error}</Alert>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)',
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#B71C1C', mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
                    My Blood Requests
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track the status of your blood requests
                </Typography>
            </Box>

            {/* Blood Requests List */}
            {bloodRequests.length === 0 ? (
                <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                        <Bloodtype sx={{ fontSize: 64, color: '#B71C1C', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 1, color: '#B71C1C' }}>
                            No Blood Requests Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You haven't made any blood requests yet.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {bloodRequests.map((request) => (
                        <Grid item xs={12} key={request._id}>
                            <Card sx={{
                                borderRadius: 4,
                                boxShadow: 2,
                                border: request.status === 'Pending' ? '2px solid #ff9800' :
                                    request.status === 'Approved' ? '2px solid #4caf50' :
                                        request.status === 'Rejected' ? '2px solid #f44336' : '1px solid #e0e0e0'
                            }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        {/* Request Info */}
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
                                                {request.contactPhone}
                                            </Typography>
                                        </Grid>

                                        {/* Blood Details */}
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

                                        {/* Urgency */}
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

                                        {/* Status */}
                                        <Grid item xs={12} md={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getStatusIcon(request.status)}
                                                <Chip
                                                    label={request.status}
                                                    color={getStatusColor(request.status)}
                                                    sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                                                />
                                            </Box>
                                        </Grid>

                                        {/* Date */}
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

                                    {/* Reason */}
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Reason:</strong> {request.reason || 'No reason provided'}
                                    </Typography>

                                    {/* Approval/Rejection Info */}
                                    {request.status === 'Approved' && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 2 }}>
                                            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                                ✅ Approved on {new Date(request.approvedAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}

                                    {request.status === 'Rejected' && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                                            <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                                                ❌ Rejected on {new Date(request.approvedAt).toLocaleDateString()}
                                            </Typography>
                                            {request.rejectionReason && (
                                                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                                                    <strong>Reason:</strong> {request.rejectionReason}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {request.status === 'Pending' && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                                            <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                                                ⏳ Your request is currently being reviewed by medical centers. You will be notified once a decision is made.
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
} 