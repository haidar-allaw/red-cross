import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, TextField, MenuItem, Card, CardContent, Button, Grid, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import axios from 'axios';

const RED = '#B71C1C';
const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export default function RequestBloodPage() {
    const [centers, setCenters] = useState([]);
    const [requestedBloodType, setRequestedBloodType] = useState('');
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [requestDialogOpen, setRequestDialogOpen] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:4000/api/centers')
            .then(({ data }) => setCenters(data))
            .catch(() => setCenters([]))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (requestedBloodType) {
            setFilteredCenters(
                centers.filter(c =>
                    Array.isArray(c.availableBloodTypes) && c.availableBloodTypes.includes(requestedBloodType)
                )
            );
        } else {
            setFilteredCenters([]);
        }
    }, [requestedBloodType, centers]);

    const handleRequestBlood = (center) => {
        setSelectedHospital(center);
        setRequestDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setRequestDialogOpen(false);
        setSelectedHospital(null);
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', py: 6 }}>
            <Container maxWidth="sm">
                <Typography variant="h3" sx={{ color: RED, fontWeight: 700, mb: 2, textAlign: 'center' }}>
                    Request Blood
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
                    Select the blood type you need to see available hospitals
                </Typography>
                <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
                    <CardContent>
                        <TextField
                            select
                            label="Blood Type Needed"
                            value={requestedBloodType}
                            onChange={e => setRequestedBloodType(e.target.value)}
                            fullWidth
                            size="medium"
                            sx={{ mb: 3 }}
                        >
                            <MenuItem value="">-- Select Blood Type --</MenuItem>
                            {bloodTypes.map(bt => (
                                <MenuItem key={bt} value={bt}>{bt}</MenuItem>
                            ))}
                        </TextField>
                        {loading && <Typography>Loading hospitals...</Typography>}
                        {requestedBloodType && !loading && (
                            filteredCenters.length > 0 ? (
                                <Box>
                                    <Typography variant="subtitle1" sx={{ mb: 2, color: RED, fontWeight: 600 }}>
                                        Hospitals with {requestedBloodType} available:
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {filteredCenters.map(center => (
                                            <Grid item xs={12} key={center._id}>
                                                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', boxShadow: 2, justifyContent: 'space-between' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <LocalHospitalIcon sx={{ color: RED, fontSize: 32, mr: 2 }} />
                                                        <Box>
                                                            <Typography variant="h6">{center.name}</Typography>
                                                            <Typography variant="body2" color="text.secondary">{center.address}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ ml: 2, bgcolor: RED, fontWeight: 600, borderRadius: 2 }}
                                                        onClick={() => handleRequestBlood(center)}
                                                    >
                                                        Request Blood
                                                    </Button>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ) : (
                                <Alert severity="info">No hospitals currently have this blood type available.</Alert>
                            )
                        )}
                    </CardContent>
                </Card>
                {/* Request Blood Dialog */}
                <Dialog open={requestDialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Request Blood</DialogTitle>
                    <DialogContent>
                        {selectedHospital && (
                            <Box>
                                <Typography variant="h6" sx={{ color: RED }}>{selectedHospital.name}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>{selectedHospital.address}</Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    You are requesting <b>{requestedBloodType}</b> blood from this hospital.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                    Please contact the hospital directly or visit for urgent needs.
                                </Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary" variant="contained" sx={{ bgcolor: RED }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
} 