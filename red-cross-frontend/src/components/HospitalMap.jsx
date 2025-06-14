import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import carIconUrl from "../assets/car.png"; // You need to add a car.png icon in assets
import hospitalIconUrl from "../assets/hospital.png"; // You need to add a hospital.png icon in assets
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

// Custom icons
const userIcon = new L.Icon({
    iconUrl: carIconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});
const hospitalIcon = new L.Icon({
    iconUrl: hospitalIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function RoutingControl({ from, to, onRoute, clearRoute }) {
    const map = useMap();
    const routingControlRef = useRef();

    // Create the routing control only once
    useEffect(() => {
        if (!map) return;
        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: from ? [L.latLng(from[0], from[1])] : [],
                routeWhileDragging: false,
                addWaypoints: false,
                draggableWaypoints: false,
                fitSelectedRoutes: true,
                showAlternatives: false,
                show: false,
                lineOptions: { styles: [{ color: '#1976d2', weight: 6 }] },
                createMarker: () => null,
            })
                .on('routesfound', function (e) {
                    if (onRoute) onRoute(e.routes[0]);
                    if (e.routes[0] && e.routes[0].bounds) map.fitBounds(e.routes[0].bounds, { padding: [50, 50] });
                })
                .addTo(map);
        }
        return () => {
            // Remove the control only on component unmount
            if (routingControlRef.current) {
                try { map.removeControl(routingControlRef.current); } catch (e) { }
                routingControlRef.current = null;
                if (clearRoute) clearRoute();
            }
        };
        // eslint-disable-next-line
    }, [map]);

    // Update waypoints when from or to changes
    useEffect(() => {
        if (!routingControlRef.current) return;
        if (from && to) {
            routingControlRef.current.setWaypoints([
                L.latLng(from[0], from[1]),
                L.latLng(to[0], to[1])
            ]);
        } else if (from) {
            routingControlRef.current.setWaypoints([
                L.latLng(from[0], from[1])
            ]);
            if (clearRoute) clearRoute();
        } else {
            routingControlRef.current.setWaypoints([]);
            if (clearRoute) clearRoute();
        }
        // eslint-disable-next-line
    }, [from, to]);

    return null;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function HospitalMap() {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [radius, setRadius] = useState(5); // in km
    const [sliderOpen, setSliderOpen] = useState(false);
    const [pendingRadius, setPendingRadius] = useState(radius);
    const watchIdRef = useRef(null);

    // Live location tracking
    useEffect(() => {
        if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = navigator.geolocation.watchPosition(
            ({ coords }) => {
                setPosition([coords.latitude, coords.longitude]);
                console.log('Geolocation update:', coords.latitude, coords.longitude);
            },
            err => {
                console.error("Geolocation error:", err);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 60000 }
        );
        return () => {
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, []);

    // Log coordinates every 5 seconds for visibility
    useEffect(() => {
        if (!position) return;
        const interval = setInterval(() => {
            console.log('Current position:', position[0], position[1]);
        }, 5000);
        return () => clearInterval(interval);
    }, [position]);

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
        fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        })
            .then(r => r.json())
            .then(data => {
                const list = data.elements.map(el => ({
                    id: el.id,
                    name: el.tags.name || "Unnamed Hospital",
                    lat: el.lat || el.center.lat,
                    lng: el.lon || el.center.lon,
                    address: el.tags["addr:full"] || el.tags["addr:street"] || ""
                }));
                setHospitals(list);
            })
            .catch(err => console.error("Overpass error:", err));
    }, [position, radius]);

    // Calculate distances for hospitals
    const hospitalsWithDistance = position
        ? hospitals.map(h => ({
            ...h,
            distance: getDistanceFromLatLonInKm(position[0], position[1], h.lat, h.lng)
        }))
        : [];

    // Clear route if selected hospital is no longer in the hospitals list
    useEffect(() => {
        if (!selectedHospital) return;
        const found = hospitals.some(h => h.lat === selectedHospital[0] && h.lng === selectedHospital[1]);
        if (!found) {
            setSelectedHospital(null);
            setRouteInfo(null);
        }
    }, [hospitals, selectedHospital]);

    if (!position) return <div>Loading your location…</div>;

    return (
        <div style={{ position: "relative", height: "100vh" }}>
            {/* Slider Button & Block - bottom center */}
            <Box sx={{
                position: 'absolute',
                left: '50%',
                bottom: 32,
                transform: 'translateX(-50%)',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 260,
                maxWidth: 350,
            }}>
                {!sliderOpen ? (
                    <>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ borderRadius: 4, fontWeight: 700, fontSize: 18, px: 4, boxShadow: 3, mb: 1 }}
                            onClick={() => setSliderOpen(true)}
                        >
                            Radius: {radius} km
                        </Button>
                    </>
                ) : (
                    <Box sx={{
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 4,
                        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        p: 3,
                        minWidth: 260,
                        maxWidth: 350,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Typography gutterBottom variant="h6" color="primary" sx={{ fontWeight: 700, letterSpacing: 1, mb: 3 }}>
                            Set Search Radius
                        </Typography>
                        <Slider
                            value={pendingRadius}
                            min={1}
                            max={20}
                            step={1}
                            onChange={(_, v) => setPendingRadius(v)}
                            valueLabelDisplay="on"
                            marks={[{ value: 1, label: '1 km' }, { value: 10, label: '10 km' }, { value: 20, label: '20 km' }]}
                            sx={{ color: '#1976d2', width: '90%' }}
                        />
                        <Divider sx={{ my: 2, width: '100%' }} />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: 3, fontWeight: 700, fontSize: 16, px: 4, width: '100%' }}
                            onClick={() => {
                                setRadius(pendingRadius);
                                setSliderOpen(false);
                            }}
                        >
                            Apply
                        </Button>
                        <Button
                            variant="text"
                            color="secondary"
                            sx={{ mt: 1, width: '100%' }}
                            onClick={() => setSliderOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>
            <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                {/* User location marker */}
                <Marker position={position} icon={userIcon}>
                    <Popup>Your live location</Popup>
                </Marker>
                {/* Hospital markers */}
                {hospitals.map(h => (
                    <Marker
                        key={h.id}
                        position={[h.lat, h.lng]}
                        icon={hospitalIcon}
                        eventHandlers={{
                            click: () => {
                                setSelectedHospital([h.lat, h.lng]);
                                setRouteInfo(null);
                            }
                        }}
                    >
                        <Popup>
                            <strong>{h.name}</strong><br />
                            {h.address}
                        </Popup>
                    </Marker>
                ))}
                <RoutingControl
                    from={position}
                    to={selectedHospital}
                    onRoute={route => setRouteInfo(route)}
                    clearRoute={() => setRouteInfo(null)}
                />
            </MapContainer>
            {/* Info panel */}
            {selectedHospital && routeInfo && (
                <div style={{
                    position: "absolute",
                    top: 32,
                    right: 32,
                    background: "rgba(255,255,255,0.85)",
                    borderRadius: 16,
                    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.25)",
                    backdropFilter: "blur(8px)",
                    padding: 28,
                    minWidth: 280,
                    zIndex: 1300,
                    maxWidth: 370,
                    border: '1px solid rgba(255,255,255,0.18)'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1976d2', letterSpacing: 1 }}>Route Info</h3>
                    <div style={{ marginBottom: 12, fontWeight: 500 }}>
                        <b>Distance:</b> {(routeInfo.summary.totalDistance / 1000).toFixed(2)} km<br />
                        <b>Duration:</b> {(routeInfo.summary.totalTime / 60).toFixed(1)} min
                    </div>
                    <ol style={{ maxHeight: 180, overflowY: 'auto', paddingLeft: 20, marginBottom: 12 }}>
                        {routeInfo.instructions && routeInfo.instructions.map((step, i) => (
                            <li key={i}>{step.text}</li>
                        ))}
                    </ol>
                    <button
                        onClick={() => {
                            setSelectedHospital(null);
                            setRouteInfo(null);
                        }}
                        style={{
                            background: "#1976d2",
                            color: "white",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 16,
                            width: "100%",
                            boxShadow: "0 2px 8px rgba(25, 118, 210, 0.15)"
                        }}
                    >
                        Clear Route
                    </button>
                </div>
            )}
        </div>
    );
}
