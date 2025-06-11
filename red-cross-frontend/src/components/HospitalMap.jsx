import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";

// Fix default marker icon issues in many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function HospitalMap() {
    const [position, setPosition] = useState(null);
    const [hospitals, setHospitals] = useState([]);

    // 1) Get user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => setPosition([coords.latitude, coords.longitude]),
            err => console.error("Geolocation error:", err)
        );
    }, []);

    // 2) Query Overpass API for nearby hospitals
    useEffect(() => {
        if (!position) return;
        const [lat, lng] = position;
        const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:5000,${lat},${lng});
        way["amenity"="hospital"](around:5000,${lat},${lng});
        rel["amenity"="hospital"](around:5000,${lat},${lng});
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
    }, [position]);

    // 3) Open Google Maps directions in a new tab
    const openGoogleMaps = hospital => {
        if (!position) return;
        const [lat, lng] = position;
        const url = new URL("https://www.google.com/maps/dir/");
        url.searchParams.set("api", "1");
        url.searchParams.set("origin", `${lat},${lng}`);
        url.searchParams.set("destination", `${hospital.lat},${hospital.lng}`);
        url.searchParams.set("travelmode", "driving");
        window.open(url.toString(), "_blank");
    };

    if (!position) return <div>Loading location…</div>;

    return (
        <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />

            {/* User location - highlighted in red */}
            <CircleMarker
                center={position}
                pathOptions={{ color: "red", fillColor: "red" }}
                radius={10}
            >
                <Popup>Your location</Popup>
            </CircleMarker>

            {/* Hospital markers */}
            {hospitals.map(h => (
                <Marker
                    key={h.id}
                    position={[h.lat, h.lng]}
                    eventHandlers={{ click: () => openGoogleMaps(h) }}
                >
                    <Popup>
                        <strong>{h.name}</strong><br />
                        {h.address}<br />
                        <button onClick={() => openGoogleMaps(h)}>Get Directions</button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
