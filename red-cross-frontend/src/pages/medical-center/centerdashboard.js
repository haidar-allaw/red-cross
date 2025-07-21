import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    Avatar,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    Chip,
    useTheme,
    useMediaQuery,
    IconButton
} from '@mui/material';
import {
    CalendarToday,
    AccessTime,
    Person,
    Bloodtype,
    LocalHospital,
    Save,
    Refresh,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import RedCrossIcon from '../../assets/redCrossIcon.png';
import { getTokenPayload } from '../../utils/jwtUtils';
import ConfirmDialog from '../../components/ConfirmDialog';

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function CenterDashboard() {
    const [centerInfo, setCenterInfo] = useState(null);
    const [availableBlood, setAvailableBlood] = useState([]);
    const [neededBlood, setNeededBlood] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [bloodRequests, setBloodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'approve', 'reject', 'delete'
    const [dialogRequestId, setDialogRequestId] = useState(null);
    const [dialogInput, setDialogInput] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogConfirmText, setDialogConfirmText] = useState('Confirm');
    const [dialogShowInput, setDialogShowInput] = useState(false);
    const [dialogInputLabel, setDialogInputLabel] = useState('');

    const openDialog = (type, requestId, options = {}) => {
        setDialogType(type);
        setDialogRequestId(requestId);
        setDialogOpen(true);
        setDialogInput(options.inputValue || '');
        setDialogContent(options.content || '');
        setDialogTitle(options.title || '');
        setDialogConfirmText(options.confirmText || 'Confirm');
        setDialogShowInput(!!options.showInput);
        setDialogInputLabel(options.inputLabel || '');
    };
    const closeDialog = () => {
        setDialogOpen(false);
        setDialogInput('');
        setDialogType('');
        setDialogRequestId(null);
    };

    const handleDialogConfirm = async () => {
        if (dialogType === 'approve') {
            try {
                const token = localStorage.getItem('authToken');
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) throw new Error('Invalid token - no center ID found');
                await axios.patch(`http://localhost:4000/api/bloodRequests/${dialogRequestId}/approve`, { centerId: payload.id });
                setBloodRequests((prev) => prev.map((req) => req._id === dialogRequestId ? { ...req, status: 'Approved', approvedAt: new Date() } : req));
                const { data: updatedCenter } = await axios.get(`http://localhost:4000/api/centers/${payload.id}`);
                setAvailableBlood(updatedCenter.availableBloodTypes || []);
            } catch (err) {
                setError('Failed to approve the request.');
            }
        } else if (dialogType === 'reject') {
            if (!dialogInput) return;
            try {
                const token = localStorage.getItem('authToken');
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) throw new Error('Invalid token - no center ID found');
                await axios.patch(`http://localhost:4000/api/bloodRequests/${dialogRequestId}/reject`, { centerId: payload.id, rejectionReason: dialogInput });
                setBloodRequests((prev) => prev.map((req) => req._id === dialogRequestId ? { ...req, status: 'Rejected', approvedAt: new Date(), rejectionReason: dialogInput } : req));
            } catch (err) {
                setError('Failed to reject the request.');
            }
        } else if (dialogType === 'delete') {
            try {
                await axios.delete(`http://localhost:4000/api/bloodRequests/${dialogRequestId}`);
                setBloodRequests((prev) => prev.filter((req) => req._id !== dialogRequestId));
            } catch (err) {
                setError('Failed to delete the request.');
            }
        } else if (dialogType === 'cancel_donation') {
            if (!dialogInput) {
                setError('A reason is required to cancel a donation.');
                return;
            }
            try {
                const token = localStorage.getItem('authToken');
                await axios.patch(`http://localhost:4000/api/blood/${dialogRequestId}/cancel`,
                    { reason: dialogInput },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setDonationRequests((prev) => prev.filter((req) => req._id !== dialogRequestId));
                setSuccess('Donation request has been successfully canceled.');
            } catch (err) {
                setError('Failed to cancel the donation request.');
            }
        } else if (dialogType === 'cancel') {
            if (!dialogInput) return;
            try {
                const token = localStorage.getItem('authToken');
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) throw new Error('Invalid token - no center ID found');
                await axios.patch(`http://localhost:4000/api/bloodRequests/${dialogRequestId}/reject`, { centerId: payload.id, rejectionReason: dialogInput });
                setBloodRequests((prev) => prev.map((req) => req._id === dialogRequestId ? { ...req, status: 'Rejected', approvedAt: new Date(), rejectionReason: dialogInput } : req));
            } catch (err) {
                setError('Failed to cancel the blood request.');
            }
        }
        closeDialog();
    };

    // Get center ID from token
    useEffect(() => {
        const fetchCenter = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('authToken');
                if (!token) throw new Error('Not authenticated');

                // Decode token to get center id using proper JWT decoding
                const payload = getTokenPayload(token);
                if (!payload || !payload.id) {
                    throw new Error('Invalid token - no center ID found');
                }

                const centerId = payload.id;
                console.log('Center ID from token:', centerId);

                const { data } = await axios.get(`http://localhost:4000/api/centers/${centerId}`);
                setCenterInfo(data);
                setAvailableBlood(data.availableBloodTypes || []);
                setNeededBlood(data.neededBloodTypes || []);

                // Fetch donation requests for this center
                try {
                    console.log('Fetching donation requests for center ID:', centerId);
                    const { data: requests } = await axios.get(`http://localhost:4000/api/blood/center/${centerId}`);
                    console.log('Donation requests received:', requests);
                    console.log('First request user data:', requests[0]?.user);
                    setDonationRequests(requests.filter(req => req.status === 'scheduled'));
                } catch (err) {
                    console.error('Error fetching donation requests:', err);
                    console.error('Error response:', err.response?.data);
                    console.error('Error status:', err.response?.status);
                    console.error('Error message:', err.message);
                    // Don't set error state for this, just log it
                }

                // Fetch blood requests for this center
                try {
                    console.log('Fetching blood requests for center ID:', centerId);
                    const { data: bloodReqs } = await axios.get(`http://localhost:4000/api/bloodRequests/center/${centerId}`);
                    console.log('Blood requests received:', bloodReqs);
                    setBloodRequests(bloodReqs);
                } catch (err) {
                    console.error('Error fetching blood requests:', err);
                    console.error('Error response:', err.response?.data);
                    console.error('Error status:', err.response?.status);
                    console.error('Error message:', err.message);
                    // Don't set error state for this, just log it
                }
            } catch (err) {
                console.error('Error in fetchCenter:', err);
                setError('Failed to load center info: ' + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCenter();
    }, []);

    const handleAvailableChange = (e) => {
        setAvailableBlood(e.target.value);
    };

    const handleNeededChange = (type, quantity) => {
        setNeededBlood((prev) => {
            const existing = prev.find(b => b.type === type);
            if (existing) {
                if (quantity === '' || quantity < 0) {
                    return prev.filter(b => b.type !== type);
                }
                return prev.map(b => b.type === type ? { ...b, quantity } : b);
            } else {
                if (quantity !== '' && quantity >= 0) {
                    return [...prev, { type, quantity }];
                }
            }
            return prev;
        });
    };

    const handleSave = async () => {
        if (!centerInfo) return;
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            const payload = getTokenPayload(token);
            if (!payload || !payload.id) {
                throw new Error('Invalid token - no center ID found');
            }
            const centerId = payload.id;
            // Only send valid blood types with both type and quantity
            const filteredAvailableBlood = availableBlood
                .filter(b => typeof b.type === 'string' && b.type && typeof b.quantity === 'number' && b.quantity >= 0);

            const filteredNeededBlood = neededBlood
                .filter(b => typeof b.type === 'string' && b.type && typeof b.quantity === 'number' && b.quantity >= 0);

            console.log('Filtered availableBloodTypes:', filteredAvailableBlood);
            console.log('Filtered neededBloodTypes:', filteredNeededBlood);

            await axios.patch(
                `http://localhost:4000/api/centers/${centerId}`,
                {
                    availableBloodTypes: filteredAvailableBlood,
                    neededBloodTypes: filteredNeededBlood
                }
            );
            setSuccess('Changes saved successfully!');
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    // Complete donation request handler
    const handleCompleteDonation = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://localhost:4000/api/blood/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh data after completion
            const payload = getTokenPayload(token);
            const centerId = payload.id;
            const { data: updatedCenter } = await axios.get(`http://localhost:4000/api/centers/${centerId}`);
            setAvailableBlood(updatedCenter.availableBloodTypes || []);

            const { data: requests } = await axios.get(`http://localhost:4000/api/blood/center/${centerId}`);
            setDonationRequests(requests.filter(req => req.status === 'scheduled'));

            setSuccess('Donation completed and inventory updated!');
        } catch (err) {
            setError('Failed to complete donation.');
        }
    };

    // Cancel donation request handler
    const handleCancelRequest = (id) => {
        openDialog('cancel_donation', id, {
            title: 'Cancel Donation Request',
            content: 'Please provide a reason for cancelling this donation appointment.',
            confirmText: 'Confirm Cancellation',
            showInput: true,
            inputLabel: 'Cancellation Reason'
        });
    };

    // Approve blood request handler
    const handleApproveBloodRequest = (id) => {
        openDialog('approve', id, {
            title: 'Approve Blood Request',
            content: 'Are you sure you want to approve this blood request?',
            confirmText: 'Approve'
        });
    };

    // Reject blood request handler
    const handleRejectBloodRequest = (id) => {
        openDialog('reject', id, {
            title: 'Reject Blood Request',
            content: 'Please provide a reason for rejection:',
            confirmText: 'Reject',
            showInput: true,
            inputLabel: 'Rejection Reason'
        });
    };

    const handleCancelBloodRequest = (id) => {
        openDialog('cancel', id, {
            title: 'Cancel Blood Request',
            content: 'Please provide a reason for cancellation:',
            confirmText: 'Cancel Request',
            showInput: true,
            inputLabel: 'Cancellation Reason'
        });
    };

    const handleDeleteBloodRequest = (id) => {
        openDialog('delete', id, {
            title: 'Delete Blood Request',
            content: 'Are you sure you want to delete this blood request? This action cannot be undone.',
            confirmText: 'Delete'
        });
    };

    if (loading) return (
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

    if (error) return (
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

    if (!centerInfo) return null;

    return (
        <Box
            sx={{
                p: isSmall ? 1 : 3,
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fff 0%, #fbe9e7 100%)',
            }}
        >
            {/* Header with logo/avatar */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={RedCrossIcon} sx={{ width: 56, height: 56, bgcolor: '#fff', boxShadow: 2, mr: 2 }} />
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#B71C1C', mb: 0.5, fontFamily: 'Montserrat, sans-serif' }}>
                                Welcome back, {centerInfo.name}!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Manage your blood inventory and donation requests
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => window.location.reload()}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                            color: 'white',
                            height: 170,
                            boxShadow: '0 8px 32px rgba(33,150,243,0.12)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 20px 40px rgba(33,150,243,0.18)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        width: 56,
                                        height: 56,
                                        boxShadow: 2,
                                    }}
                                >
                                    <LocalHospital fontSize="large" />
                                </Avatar>
                                <Chip
                                    label="Active"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(76, 175, 80, 0.9)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                                    {centerInfo.isApproved ? '✓' : '⏳'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                                    {centerInfo.isApproved ? 'Approved' : 'Pending'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                            color: 'white',
                            height: 170,
                            boxShadow: '0 8px 32px rgba(76,175,80,0.12)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 20px 40px rgba(76,175,80,0.18)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        width: 56,
                                        height: 56,
                                        boxShadow: 2,
                                    }}
                                >
                                    <Bloodtype fontSize="large" />
                                </Avatar>
                                <Chip
                                    label={`${availableBlood.length} types`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                                    {availableBlood.length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                                    Available Blood Types
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                            color: 'white',
                            height: 170,
                            boxShadow: '0 8px 32px rgba(255,152,0,0.12)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 20px 40px rgba(255,152,0,0.18)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        width: 56,
                                        height: 56,
                                        boxShadow: 2,
                                    }}
                                >
                                    <Person fontSize="large" />
                                </Avatar>
                                <Chip
                                    label={`${neededBlood.length} types`}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                                    {neededBlood.length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                                    Needed Blood Types
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #B71C1C 0%, #d32f2f 100%)',
                            color: 'white',
                            height: 170,
                            boxShadow: '0 8px 32px rgba(183,28,28,0.12)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 20px 40px rgba(183,28,28,0.18)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        width: 56,
                                        height: 56,
                                        boxShadow: 2,
                                    }}
                                >
                                    <CalendarToday fontSize="large" />
                                </Avatar>
                                <Chip
                                    label="Scheduled"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                                    {donationRequests.length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                                    Donation Requests
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                            color: 'white',
                            height: 170,
                            boxShadow: '0 8px 32px rgba(156,39,176,0.12)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px) scale(1.03)',
                                boxShadow: '0 20px 40px rgba(156,39,176,0.18)',
                            },
                        }}
                    >
                        <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.18)',
                                        width: 56,
                                        height: 56,
                                        boxShadow: 2,
                                    }}
                                >
                                    <Bloodtype fontSize="large" />
                                </Avatar>
                                <Chip
                                    label="Active"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: 16,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Montserrat, sans-serif', letterSpacing: 1 }}>
                                    {bloodRequests.length}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.93, fontWeight: 500, fontSize: 18 }}>
                                    Blood Requests
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Content Grid */}
            <Grid container spacing={3}>
                {/* Center Info & Blood Management */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, height: 'fit-content', boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#B71C1C', fontFamily: 'Montserrat, sans-serif' }}>
                                Center Information
                            </Typography>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                    {centerInfo.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {centerInfo.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {centerInfo.address}
                                </Typography>
                                {centerInfo.hospitalCardImage && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Hospital Card:</Typography>
                                        <Avatar
                                            src={`http://localhost:4000/${centerInfo.hospitalCardImage}`}
                                            variant="rounded"
                                            sx={{ width: 120, height: 120, boxShadow: 2 }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#B71C1C', fontFamily: 'Montserrat, sans-serif' }}>
                                Blood Inventory Management
                            </Typography>

                            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Available Blood Types & Quantities
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {bloodTypes.map((bt) => {
                                    const found = availableBlood.find((b) => b.type === bt);
                                    const qty = found ? found.quantity : 0;
                                    let warning = '';
                                    if (qty === 0) warning = 'Out of stock!';
                                    else if (qty <= 2) warning = 'Low stock';
                                    return (
                                        <Box key={bt} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                                            <Typography sx={{ minWidth: 40 }}>{bt}</Typography>
                                            <TextField
                                                type="number"
                                                size="small"
                                                label="Quantity"
                                                value={found ? found.quantity : ''}
                                                onChange={e => {
                                                    const qty = parseInt(e.target.value, 10);
                                                    setAvailableBlood((prev) => {
                                                        const exists = prev.find((b) => b.type === bt);
                                                        if (exists) {
                                                            // If cleared, remove the entry
                                                            if (e.target.value === '' || isNaN(qty)) {
                                                                return prev.filter((b) => b.type !== bt);
                                                            }
                                                            return prev.map((b) => b.type === bt ? { ...b, quantity: qty } : b);
                                                        } else {
                                                            if (e.target.value === '' || isNaN(qty)) return prev;
                                                            return [...prev, { type: bt, quantity: qty }];
                                                        }
                                                    });
                                                }}
                                                inputProps={{ min: 0 }}
                                                sx={{ width: 100 }}
                                            />
                                            {warning && (
                                                <Typography sx={{ color: qty === 0 ? 'error.main' : 'warning.main', fontWeight: 600, ml: 1 }}>
                                                    {warning}
                                                </Typography>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 3 }}>
                                Needed Blood Types & Quantities
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {bloodTypes.map((bt) => {
                                    const found = neededBlood.find((b) => b.type === bt);
                                    return (
                                        <Box key={bt} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
                                            <Typography sx={{ minWidth: 40 }}>{bt}</Typography>
                                            <TextField
                                                type="number"
                                                size="small"
                                                label="Quantity"
                                                value={found ? found.quantity : ''}
                                                onChange={e => {
                                                    const qty = parseInt(e.target.value, 10);
                                                    handleNeededChange(bt, isNaN(qty) ? '' : qty);
                                                }}
                                                inputProps={{ min: 0 }}
                                                sx={{ width: 100 }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>

                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSave}
                                disabled={saving}
                                sx={{
                                    bgcolor: '#4CAF50',
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    width: '100%',
                                    '&:hover': { bgcolor: '#388E3C' },
                                }}
                            >
                                {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Donation Requests */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#B71C1C', fontFamily: 'Montserrat, sans-serif' }}>
                                Scheduled Donation Requests
                            </Typography>

                            {donationRequests.length === 0 ? (
                                <Alert severity="info" sx={{ fontSize: 16, p: 2 }}>
                                    No scheduled donation requests at the moment.
                                </Alert>
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        {donationRequests.slice(0, 3).map((request) => (
                                            <Grid item xs={12} key={request._id}>
                                                <Card sx={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 3,
                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    }
                                                }}>
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

                                                            <Grid item xs={12} md={3}>
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
                                                                        {new Date(request.timestamp).toLocaleTimeString([], {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>

                                                            <Grid item xs={12} md={2}>
                                                                <Chip
                                                                    label={request.status}
                                                                    sx={{
                                                                        bgcolor: request.status === 'scheduled' ? '#1976d2' : '#666',
                                                                        color: 'white',
                                                                        fontWeight: 600,
                                                                        textTransform: 'capitalize'
                                                                    }}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} md={2}>
                                                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        size="small"
                                                                        sx={{
                                                                            bgcolor: '#4caf50',
                                                                            fontWeight: 600,
                                                                            '&:hover': { bgcolor: '#388e3c' }
                                                                        }}
                                                                        onClick={() => handleCompleteDonation(request._id)}
                                                                    >
                                                                        Complete
                                                                    </Button>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={() => handleCancelRequest(request._id)}
                                                                        disabled={deletingId === request._id}
                                                                        sx={{ fontWeight: 600 }}
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
                                    {donationRequests.length > 3 && (
                                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                                            <Button variant="outlined" color="primary" onClick={() => window.location.href = '/center/donations'}>
                                                Read More
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Blood Requests Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 4, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#9C27B0', fontFamily: 'Montserrat, sans-serif' }}>
                                Blood Requests
                            </Typography>

                            {bloodRequests.length === 0 ? (
                                <Alert severity="info" sx={{ fontSize: 16, p: 2 }}>
                                    No blood requests at the moment.
                                </Alert>
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        {bloodRequests.filter(req => req.status !== 'Approved' && req.status !== 'Rejected').slice(0, 3).map((request) => (
                                            <Grid item xs={12} key={request._id}>
                                                <Card sx={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 3,
                                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                                    position: 'relative',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                    }
                                                }}>
                                                    {(request.status === 'Approved' || request.status === 'Rejected') && (
                                                        <IconButton
                                                            size="small"
                                                            aria-label="delete"
                                                            onClick={() => handleDeleteBloodRequest(request._id)}
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
                                                    )}
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
                                                                {request.requestType === 'Individual' && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {request.userEmail ? request.userEmail : 'No email available'}
                                                                    </Typography>
                                                                )}
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

                                                            <Grid item xs={12} md={3}>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                                    <strong>Reason:</strong> {request.reason || 'No reason provided'}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    {request.status === 'Approved' ? (
                                                                        <Button
                                                                            variant="contained"
                                                                            color="success"
                                                                            size="small"
                                                                            disabled
                                                                            sx={{
                                                                                bgcolor: '#4caf50',
                                                                                fontWeight: 600,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            Accepted
                                                                        </Button>
                                                                    ) : request.status === 'Rejected' ? (
                                                                        <Button
                                                                            variant="contained"
                                                                            color="error"
                                                                            size="small"
                                                                            disabled
                                                                            sx={{
                                                                                bgcolor: '#f44336',
                                                                                fontWeight: 600,
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    ) : (
                                                                        <Button
                                                                            variant="contained"
                                                                            color="primary"
                                                                            size="small"
                                                                            sx={{
                                                                                bgcolor: '#9C27B0',
                                                                                fontWeight: 600,
                                                                                '&:hover': { bgcolor: '#7B1FA2' }
                                                                            }}
                                                                            onClick={() => handleApproveBloodRequest(request._id)}
                                                                        >
                                                                            Accept
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        size="small"
                                                                        sx={{ fontWeight: 600 }}
                                                                        onClick={() => handleCancelBloodRequest(request._id)}
                                                                        disabled={request.status === 'Rejected'}
                                                                    >
                                                                        {request.status === 'Rejected' ? 'Cancelled' : 'Cancel'}
                                                                    </Button>
                                                                </Box>
                                                            </Grid>
                                                            {request.status === 'Rejected' && (
                                                                <Grid item xs={12} md={3}>
                                                                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                                                        <strong>Cancellation Reason:</strong> {request.rejectionReason}
                                                                    </Typography>
                                                                </Grid>
                                                            )}
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {bloodRequests.length > 3 && (
                                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                                            <Button variant="outlined" color="primary" onClick={() => window.location.href = '/center/blood-requests'}>
                                                Read More
                                            </Button>
                                        </Box>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <ConfirmDialog
                open={dialogOpen}
                title={dialogTitle}
                content={dialogContent}
                onClose={(confirmed) => {
                    if (confirmed) handleDialogConfirm(); else closeDialog();
                }}
                confirmText={dialogConfirmText}
                showInput={dialogShowInput}
                inputLabel={dialogInputLabel}
                inputValue={dialogInput}
                setInputValue={setDialogInput}
            />
        </Box>
    );
} 