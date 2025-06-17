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
    role: 'patient', // default role
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
      await axios.post('/api/auth/register', {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        password:  form.password,
        role:      form.role,       // send role to backend
      });
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

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
            select
            name="role"
            label="I am a"
            size="small"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="donor">Donor</MenuItem>
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
