// HospitalMapScreen.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';

import carIcon from '../assets/car.png';
import hospitalIcon from '../assets/hospital.png';

const { width, height } = Dimensions.get('window');
const LAT_DELTA = 0.0922;
const LNG_DELTA = LAT_DELTA * (width / height);

// smoothing factor for heading (0 = no movement, 1 = raw)
const SMOOTHING = 0.2;

export default function HospitalMapScreen() {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [hospitals, setHospitals] = useState([]);
  const [radius, setRadius] = useState(5);
  const [selected, setSelected] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routing, setRouting] = useState(false);

  const mapRef = useRef();
  const headingRef = useRef(0);

  // 1) get permissions and subscribe to location+heading
  useEffect(() => {
    let headingSub = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc.coords);

      // location updates
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        ({ coords }) => setLocation(coords)
      );

      // heading updates
      headingSub = await Location.watchHeadingAsync((hd) => {
        const raw = hd.trueHeading ?? hd.magHeading;
        // exponential smoothing
        const smooth = headingRef.current + (raw - headingRef.current) * SMOOTHING;
        headingRef.current = smooth;
        setHeading(smooth);
      });
    })();

    return () => {
      if (headingSub && headingSub.remove) headingSub.remove();
    };
  }, []);

  // 2) fetch hospitals
  useEffect(() => {
    if (!location) return;
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius * 1000},${location.latitude},${location.longitude});
        way["amenity"="hospital"](around:${radius * 1000},${location.latitude},${location.longitude});
        rel["amenity"="hospital"](around:${radius * 1000},${location.latitude},${location.longitude});
      );
      out center;`;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: query,
    })
      .then((r) => r.json())
      .then((data) => {
        const list = data.elements.map((e) => ({
          id: e.id,
          name: e.tags.name || 'Unnamed Hospital',
          latitude: e.lat ?? e.center.lat,
          longitude: e.lon ?? e.center.lon,
        }));
        setHospitals(list);
        setSelected(null);
        setRouteCoords([]);
      })
      .catch(console.error);
  }, [location, radius]);

  // 3) when user taps a hospital
  const onHospitalPress = async (h) => {
    if (routing) return;
    setRouting(true);
    setSelected(h);
    setRouteCoords([]);

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${location.longitude},${location.latitude};` +
      `${h.longitude},${h.latitude}` +
      `?overview=simplified&geometries=geojson`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.code === 'Ok' && json.routes.length) {
        const coords = json.routes[0].geometry.coordinates.map(
          ([lng, lat]) => ({ latitude: lat, longitude: lng })
        );
        setRouteCoords(coords);
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        });
      }
    } catch (e) {
      console.error('OSRM route error', e);
    } finally {
      setRouting(false);
    }
  };

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LAT_DELTA,
          longitudeDelta: LNG_DELTA,
        }}
        showsUserLocation={false}
      >
        {/* User as rotating car */}
        <Marker
          coordinate={location}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
          rotation={heading}
        >
          <Image source={carIcon} style={styles.icon} />
        </Marker>

        {/* Hospital pins */}
        {hospitals.map((h) => (
          <Marker
            key={h.id}
            coordinate={{ latitude: h.latitude, longitude: h.longitude }}
            onPress={() => onHospitalPress(h)}
          >
            <Image source={hospitalIcon} style={styles.icon} />
          </Marker>
        ))}

        {/* Route line */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={6}
            strokeColor="#1976d2"
          />
        )}
      </MapView>

      {/* Loading overlay */}
      {routing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      )}

      {/* Radius slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Radius: {radius} km</Text>
        <Slider
          style={{ width: 200 }}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={radius}
          onSlidingComplete={(v) => setRadius(v)}
        />
      </View>

      {/* Clear route */}
      {routeCoords.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => {
            setSelected(null);
            setRouteCoords([]);
          }}
        >
          <Text style={styles.clearText}>Clear Route</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  map:             { flex: 1 },
  center:          { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon:            { width: 32, height: 32, resizeMode: 'contain' },
  sliderContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sliderLabel:     { fontWeight: '600', marginBottom: 4 },
  clearBtn:        {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#1976d2',
    padding: 10,
    borderRadius: 6,
  },
  clearText:       { color: '#fff', fontWeight: '600' },
  loadingOverlay:  {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
