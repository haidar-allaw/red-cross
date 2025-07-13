import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HospitalList() {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [radius, setRadius] = useState(5); // in km
  const [sliderOpen, setSliderOpen] = useState(false);
  const [pendingRadius, setPendingRadius] = useState(radius);
  const watchIdRef = useRef(null);

  // Live location tracking
  useEffect(() => {
    if (watchIdRef.current)
      navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
        console.log('Geolocation update:', coords.latitude, coords.longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }
    );
    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Fetch hospitals
  useEffect(() => {
    if (!position) return;
    const [lat, lng] = position;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
        way["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
        rel["amenity"="hospital"](around:${radius * 1000},${lat},${lng});
      );
      out center;`;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    })
      .then((r) => r.json())
      .then((data) => {
        const list = data.elements.map((el) => ({
          id: el.id,
          name: el.tags.name || 'Unnamed Hospital',
          lat: el.lat || el.center.lat,
          lng: el.lon || el.center.lon,
          address: el.tags['addr:full'] || el.tags['addr:street'] || '',
        }));
        setHospitals(list);
      })
      .catch((err) => console.error('Overpass error:', err));
  }, [position, radius]);

  // Calculate distances for hospitals
  const hospitalsWithDistance = position
    ? hospitals.map((h) => ({
        ...h,
        distance: getDistanceFromLatLonInKm(
          position[0],
          position[1],
          h.lat,
          h.lng
        ),
      }))
    : [];

  const handleGetDirections = (hospital) => {
    // Navigate to map view with the selected hospital coordinates
    navigate(`/hospitals?lat=${hospital.lat}&lng=${hospital.lng}`);
  };

  if (!position) return <div>Loading your location…</div>;

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px',
        paddingTop: 'var(--header-height)', // Responsive top padding
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#1976d2',
              fontSize: '24px',
              fontWeight: '700',
            }}
          >
            Nearby Hospitals ({hospitalsWithDistance.length})
          </h2>
        </div>

        {/* Radius Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: '600', color: '#666' }}>
            Search Radius:
          </span>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSliderOpen(true)}
            style={{ borderRadius: '8px' }}
          >
            {radius} km
          </Button>
        </div>
      </div>

      {/* Hospital List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {hospitalsWithDistance
          .sort((a, b) => a.distance - b.distance)
          .map((hospital, index) => (
            <div
              key={hospital.id}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      color: '#1976d2',
                      fontSize: '18px',
                      fontWeight: '600',
                    }}
                  >
                    {hospital.name}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      color: '#666',
                      fontSize: '14px',
                    }}
                  >
                    {hospital.address || 'Address not available'}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#4caf50',
                      fontWeight: '600',
                    }}
                  >
                    <span>📍</span>
                    <span>{hospital.distance.toFixed(1)} km away</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleGetDirections(hospital)}
                    style={{
                      padding: '8px 16px',
                      background: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            </div>
          ))}

        {hospitalsWithDistance.length === 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ color: '#666', marginBottom: '10px' }}>
              No hospitals found
            </h3>
            <p style={{ color: '#999' }}>Try increasing the search radius</p>
          </div>
        )}
      </div>

      {/* View Toggle Box - Bottom Left */}
      <div className="view-toggle-box">
        <button
          onClick={() => navigate('/hospitals')}
          style={{
            padding: '8px 16px',
            background: '#1976d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          🗺️ Map
        </button>
        <button
          onClick={() => navigate('/hospitals?view=list')}
          style={{
            padding: '8px 16px',
            background: '#4caf50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          👥 List
        </button>
      </div>

      {/* Slider for radius control */}
      {sliderOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: '300px',
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            color="primary"
            style={{ fontWeight: 700, marginBottom: '20px' }}
          >
            Set Search Radius
          </Typography>
          <Slider
            value={pendingRadius}
            min={1}
            max={20}
            step={1}
            onChange={(_, v) => setPendingRadius(v)}
            valueLabelDisplay="on"
            marks={[
              { value: 1, label: '1 km' },
              { value: 10, label: '10 km' },
              { value: 20, label: '20 km' },
            ]}
            style={{ color: '#1976d2', width: '100%', marginBottom: '20px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ flex: 1, borderRadius: '8px' }}
              onClick={() => {
                setRadius(pendingRadius);
                setSliderOpen(false);
              }}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              style={{ flex: 1, borderRadius: '8px' }}
              onClick={() => setSliderOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
