// SignUpPage.jsx
import React, { useState, useEffect, useRef } from 'react';
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const RED = '#B71C1C';
const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

// Add the search control once, in 'button' style to avoid duplicates
function SearchControl({ onSelect }) {
  const map = useMap();
  useEffect(() => {
    map.whenReady(() => {
      // Only add control if not already present
      if (!map._controlsAdded) {
        const provider = new OpenStreetMapProvider();
        const control = new GeoSearchControl({
          provider,
          style: 'button',     // use 'button' style to avoid a second bar
          showMarker: false,
          showPopup: false
        });
        map.addControl(control);
        map.on('geosearch/showlocation', (e) => {
          const { x: lng, y: lat } = e.location;
          onSelect([lat, lng]);
        });
        // mark as added so we don't add again
        map._controlsAdded = true;
      }
    });
    return () => {
      // cleanup listeners
      map.off('geosearch/showlocation');
    };
  }, [map, onSelect]);
  return null;
}

// Allow clicking to pick location
function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

export default function SignUpPage() {
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({
    firstName: '', lastName: '', centerName: '',
    email: '', password: '', confirm: '',
    phoneNumber: '', bloodtype: '', address: '',
    locationLat: null, locationLng: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [hospitalCardImage, setHospitalCardImage] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectLocation = ([lat, lng]) => {
    setForm({ ...form, locationLat: lat, locationLng: lng });
    setMapOpen(false);
  };

  // When dialog opens, invalidate size to ensure map panes initialized
  useEffect(() => {
    if (mapOpen && mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [mapOpen]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords must match');
      return;
    }
    if (role === 'medical center' && !form.locationLat) {
      setError('Please select your location');
      return;
    }
    if (role === 'medical center' && !hospitalCardImage) {
      setError('Please upload your hospital card image');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const endpoint = role === 'medical center'
        ? 'http://localhost:4000/api/centers/signup'
        : 'http://localhost:4000/api/users/signup';
      if (role === 'medical center') {
        const formData = new FormData();
        formData.append('name', form.centerName);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('phoneNumber', form.phoneNumber);
        formData.append('address', form.address);
        formData.append('location[latitude]', form.locationLat);
        formData.append('location[longitude]', form.locationLng);
        formData.append('hospitalCardImage', hospitalCardImage);
        await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const payload = {
          firstname: form.firstName,
          lastname: form.lastName,
          email: form.email,
          password: form.password,
          phoneNumber: form.phoneNumber,
          bloodtype: form.bloodtype,
          address: form.address,
          role: 'user'
        };
        await axios.post(endpoint, payload);
      }
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ maxWidth: 500, width: '100%', p: 4, position: 'relative' }}>
        <Avatar
          sx={{
            bgcolor: RED,
            width: 56,
            height: 56,
            position: 'absolute',
            top: -28,
            left: 'calc(50% - 28px)'
          }}
        >
          <PersonAddIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box mt={4} textAlign="center">
          <Typography variant="h5" sx={{ color: RED, fontWeight: 600 }}>
            Create Account
          </Typography>
        </Box>

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            select
            name="role"
            label="Register as"
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 3 }}
          >
            <MenuItem value="user">Patient</MenuItem>
            <MenuItem value="medical center">Medical Center</MenuItem>
          </TextField>

          <Grid container spacing={2}>
            {role === 'medical center' ? (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="centerName"
                    label="Center Name"
                    fullWidth
                    size="small"
                    value={form.centerName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    size="small"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    size="small"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    size="small"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setMapOpen(true)}
                  >
                    {form.locationLat
                      ? `Location set: ${form.locationLat.toFixed(4)}, ${form.locationLng.toFixed(4)}`
                      : 'Select Location on Map'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{ bgcolor: '#e0e0e0', color: '#333', mt: 1 }}
                  >
                    {hospitalCardImage ? hospitalCardImage.name : 'Upload Hospital Card Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={e => setHospitalCardImage(e.target.files[0])}
                    />
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    fullWidth
                    size="small"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    size="small"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    size="small"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    size="small"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    name="bloodtype"
                    label="Blood Type"
                    fullWidth
                    size="small"
                    value={form.bloodtype}
                    onChange={handleChange}
                    required
                  >
                    {bloodTypes.map(bt => (
                      <MenuItem key={bt} value={bt}>{bt}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    size="small"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                size="small"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="confirm"
                label="Confirm Password"
                type="password"
                fullWidth
                size="small"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: RED, py: 1.5, fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign Up'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account? <Link component={RouterLink} to="/login" underline="hover">Sign in</Link>
          </Typography>
        </Box>
      </Paper>

      {/* Map Selection Dialog */}
      <Dialog fullScreen open={mapOpen} onClose={() => setMapOpen(false)}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Select Location
          <IconButton
            aria-label="close"
            onClick={() => setMapOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <MapContainer
            whenCreated={map => { mapRef.current = map; }}
            center={[33.895, 35.5]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <SearchControl onSelect={handleSelectLocation} />
            <LocationPicker onSelect={handleSelectLocation} />
            {form.locationLat && (
              <Marker position={[form.locationLat, form.locationLng]} />
            )}
          </MapContainer>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setMapOpen(false)} color="secondary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
