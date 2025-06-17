// LoginPage.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Branding colors
const RED_PRIMARY = '#B71C1C';
const RED_SECONDARY = '#E53935';
const BACKDROP = 'rgba(183,28,28,0.1)';

// Styled containers
const FullScreen = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${BACKDROP} 0%, ${BACKDROP} 100%)`,
});

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  width: 360,
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 36px rgba(0,0,0,0.24)',
  backdropFilter: 'blur(4px)',
  backgroundColor: '#ffffff',
}));

const Logo = styled(Avatar)({
  margin: '0 auto',
  backgroundColor: '#fff',
  width: 72,
  height: 72,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
});

const SubmitBtn = styled(Button)({
  marginTop: 24,
  background: `linear-gradient(90deg, ${RED_PRIMARY} 0%, ${RED_SECONDARY} 100%)`,
  color: '#fff',
  fontWeight: 700,
  padding: '12px 0',
  borderRadius: 32,
  transition: 'transform 0.2s',
  '&:hover': {
    background: `linear-gradient(90deg, ${RED_SECONDARY} 0%, ${RED_PRIMARY} 100%)`,
    transform: 'scale(1.02)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  },
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(
        'http://localhost:4000/api/users/login',
        { email, password }
      );
      localStorage.setItem('authToken', data.token);
      // if admin, go to /admin, else to home
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login failed. Check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FullScreen>
      <FormCard>
        <Logo>
          <LockOutlinedIcon sx={{ color: RED_PRIMARY, fontSize: 36 }} />
        </Logo>
        <Typography
          variant="h5"
          sx={{ mt: 2, mb: 1, fontWeight: 600, color: RED_PRIMARY }}
        >
          Red Cross Portal
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: '#555' }}>
          Secure access — please sign in
        </Typography>

        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mb: 2, fontSize: 14 }}
          >
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            required
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          <SubmitBtn type="submit" fullWidth disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </SubmitBtn>
        </Box>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            px: 1,
          }}
        >
          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ fontSize: 14 }}
          >
            Forgot password?
          </Link>
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ fontSize: 14 }}
          >
            Sign up
          </Link>
        </Box>
      </FormCard>
    </FullScreen>
  );
}
