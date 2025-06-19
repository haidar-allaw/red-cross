// DonateBloodPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Grid
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import axios from 'axios';

export default function DonateBloodPage() {
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [form, setForm] = useState({
    medicalCenter: '',
    bloodtype: '',
    units: '',
    date: '',
    note: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const RED = '#B71C1C';
  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // fetch list of approved centers
  useEffect(() => {
    setLoadingCenters(true);
    axios.get('http://localhost:4000/api/centers')
      .then(({ data }) => setCenters(data))
      .catch(() => setCenters([]))
      .finally(() => setLoadingCenters(false));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await axios.post('/api/blood/donate', {
        medicalCenter: form.medicalCenter,
        bloodtype:     form.bloodtype,
        unit:          Number(form.units),
        timestamp:     form.date,
        note:          form.note || undefined
      });
      setSuccess('Thank you for your donation!');
      setForm({ medicalCenter: '', bloodtype: '', units: '', date: '', note: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCenters) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, width: 600, boxShadow: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <LocalHospitalIcon sx={{ fontSize: 48, color: RED }} />
          <Typography variant="h5" sx={{ color: RED, mt: 1 }}>Donate Blood</Typography>
        </Box>
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        {success && <Typography color="primary" sx={{ mb: 1 }}>{success}</Typography>}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="medicalCenter"
                label="Medical Center"
                fullWidth
                size="small"
                required
                value={form.medicalCenter}
                onChange={handleChange}
              >
                {centers.map(c => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="bloodtype"
                label="Blood Type"
                fullWidth
                size="small"
                required
                value={form.bloodtype}
                onChange={handleChange}
              >
                {bloodTypes.map(bt => (
                  <MenuItem key={bt} value={bt}>
                    {bt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="units"
                label="Units (ml)"
                type="number"
                fullWidth
                size="small"
                required
                value={form.units}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date of Donation"
                type="date"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                value={form.date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note (optional)"
                fullWidth
                size="small"
                multiline
                rows={2}
                value={form.note}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: RED, py: 1.5 }}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Donation'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
