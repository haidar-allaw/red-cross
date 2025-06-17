// SignUpPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Link,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    phoneNumber: '',
    bloodtype: '',
    address: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const RED = '#B71C1C';

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return setError('Passwords must match');
    }
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/users/signup', {
        firstname:   form.firstName,
        lastname:    form.lastName,
        email:       form.email,
        password:    form.password,
        phoneNumber: form.phoneNumber,
        bloodtype:   form.bloodtype,
        address:     form.address,
        role:        form.role,
      });
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: 320, textAlign: 'center', boxShadow: 3 }}>
        <Avatar sx={{ m: '0 auto', bgcolor: RED, mb: 2 }}>
          <PersonAddIcon />
        </Avatar>
        <Typography variant="h6" gutterBottom sx={{ color: RED }}>
          Create Account
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 1, fontSize: 14 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gap: 2 }}
        >
          <TextField
            name="firstName"
            label="First Name"
            size="small"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            name="lastName"
            label="Last Name"
            size="small"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            size="small"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            size="small"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            name="confirm"
            label="Confirm Password"
            type="password"
            size="small"
            value={form.confirm}
            onChange={handleChange}
            required
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            size="small"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            select
            name="bloodtype"
            label="Blood Type"
            size="small"
            value={form.bloodtype}
            onChange={handleChange}
            required
          >
            {bloodTypes.map((bt) => (
              <MenuItem key={bt} value={bt}>
                {bt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="address"
            label="Address"
            size="small"
            value={form.address}
            onChange={handleChange}
          />
          <TextField
            select
            name="role"
            label="I am a"
            size="small"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="user">Patient</MenuItem>
            <MenuItem value="medical center">Medical Center</MenuItem>
          </TextField>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: RED, py: 1.5 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>
        </Box>
        <Typography sx={{ mt: 2, fontSize: 14 }}>
          Already registered?{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            Sign in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
