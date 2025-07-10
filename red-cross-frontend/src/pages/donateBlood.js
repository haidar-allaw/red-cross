// DonateBloodPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Container,
  Alert,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

export default function DonateBloodPage() {
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [form, setForm] = useState({
    medicalCenter: '',
    bloodtype: '',
    units: '',
    date: '',
    time: '' // Add time field
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const RED = '#B71C1C';
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  const [requestedBloodType, setRequestedBloodType] = useState('');
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // fetch list of approved centers
  useEffect(() => {
    setLoadingCenters(true);
    axios.get('http://localhost:4000/api/centers')
      .then(({ data }) => setCenters(data))
      .catch(() => setCenters([]))
      .finally(() => setLoadingCenters(false));
  }, []);

  // Filter centers when requestedBloodType changes
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to donate blood');
        return;
      }

      console.log('Submitting donation with token:', token);
      const response = await axios.post('http://localhost:4000/api/blood/donate', {
        medicalCenter: form.medicalCenter,
        bloodtype: form.bloodtype,
        unit: Number(form.units),
        timestamp: form.date + 'T' + form.time // Combine date and time for backend
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Donation response:', response.data);
      setSuccess('Thank you for your donation! Your appointment has been scheduled.');
      setForm({ medicalCenter: '', bloodtype: '', units: '', date: '', time: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestBlood = (center) => {
    setSelectedHospital(center);
    setRequestDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setRequestDialogOpen(false);
    setSelectedHospital(null);
  };

  if (loadingCenters) {
    return (
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <CircularProgress size={60} sx={{ color: RED }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${RED} 0%, #d32f2f 100%)`,
              boxShadow: '0 8px 32px rgba(183, 28, 28, 0.3)',
              mb: 2
            }}
          >
          </Box>
          <Typography
            variant="h3"
            sx={{
              color: RED,
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Donate Blood
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Your donation can save up to three lives. Every drop counts.
          </Typography>
        </Box>

        {/* Request Blood Section */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxWidth: 500,
            mx: 'auto',
            mb: 4
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${RED} 0%, #d32f2f 100%)`,
              py: 3,
              px: 4,
              color: 'white'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Request Blood
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Select the blood type you need to see available hospitals
            </Typography>
          </Box>
          <CardContent sx={{ p: 4 }}>
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
            {requestedBloodType && (
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

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${RED} 0%, #d32f2f 100%)`,
              py: 3,
              px: 4,
              color: 'white'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Donation Form
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Please fill in the details below to schedule your blood donation
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Left column */}
                <Grid item xs={12} md={6}>
                  {/* Medical Center */}
                  <Box sx={{ position: 'relative', mb: 3 }}>

                    <TextField
                      select
                      name="medicalCenter"
                      label="Medical Center"
                      fullWidth
                      size="medium"
                      required
                      value={form.medicalCenter}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pl: 5,
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: RED },
                          '&.Mui-focused fieldset': { borderColor: RED },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: RED },
                      }}
                    >
                      {centers.map(c => (
                        <MenuItem key={c._id} value={c._id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Blood Type */}
                  <Box sx={{ position: 'relative', mb: 3 }}>

                    <TextField
                      select
                      name="bloodtype"
                      label="Blood Type"
                      fullWidth
                      size="medium"
                      required
                      value={form.bloodtype}
                      onChange={handleChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pl: 5,
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: RED },
                          '&.Mui-focused fieldset': { borderColor: RED },
                        },
                        '& .MuiInputLabel-root.Mui-focused': { color: RED },
                      }}
                    >
                      {bloodTypes.map(bt => (
                        <MenuItem key={bt} value={bt}>
                          {bt}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  {/* Units */}
                  <TextField
                    name="units"
                    label="Units (ml)"
                    type="number"
                    fullWidth
                    size="medium"
                    required
                    value={form.units}
                    onChange={handleChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: RED },
                        '&.Mui-focused fieldset': { borderColor: RED },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: RED },
                    }}
                  />

                  <CalendarTodayIcon
                    sx={{
                      position: 'absolute',
                      left: 12,
                      top: 16,
                      color: 'text.secondary',
                      zIndex: 1
                    }}
                  />
                  <TextField
                    name="date"
                    label="Date of Donation"
                    type="date"
                    fullWidth
                    size="medium"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={form.date}
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        pl: 5,
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: RED },
                        '&.Mui-focused fieldset': { borderColor: RED },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: RED },
                    }}
                  />
                  {/* Time Picker */}
                  <TextField
                    name="time"
                    label="Time of Donation"
                    type="time"
                    fullWidth
                    size="medium"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={form.time}
                    onChange={handleChange}
                    sx={{
                      mt: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: RED },
                        '&.Mui-focused fieldset': { borderColor: RED },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: RED },
                    }}
                  />

                  {/* Divider */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  {/* Submit button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      background: `linear-gradient(135deg, ${RED} 0%, #d32f2f 100%)`,
                      py: 2,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 32px rgba(183, 28, 28, 0.3)',
                      '&:hover': {
                        background: `linear-gradient(135deg, #d32f2f 0%, ${RED} 100%)`,
                        boxShadow: '0 12px 40px rgba(183, 28, 28, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Submit Donation'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
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

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Thank you for making a difference in someone life
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
