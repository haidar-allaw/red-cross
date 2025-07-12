// MapScreen.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/centers/all`);
        setCenters(data.filter(c => c.isApproved));
      } catch {
        Alert.alert('Error', 'Could not load medical centers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = centers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showDetails = c => {
    Alert.alert(
      c.name,
      `Email: ${c.email}\nPhone: ${c.phoneNumber}\nAddress: ${c.address}`
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#B71C1C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="map" size={40} color="#B71C1C" />
        <Text style={styles.title}>Find Blood Centers</Text>
        <Text style={styles.subtitle}>Locate nearby donation centers</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      <ScrollView style={styles.list}>
        {filtered.map(c => (
          <TouchableOpacity
            key={c._id}
            style={styles.card}
            onPress={() => showDetails(c)}
          >
            {/* Name & Stock Status */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{c.name}</Text>
              <View style={styles.status}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: c.availableBloodTypes.length ? '#4CAF50' : '#F44336' },
                  ]}
                />
                <Text style={styles.statusText}>
                  {c.availableBloodTypes.length ? 'In Stock' : 'Out of Stock'}
                </Text>
              </View>
            </View>

            {/* Contact Info */}
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.detailText}>{c.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="mail" size={16} color="#666" />
              <Text style={styles.detailText}>{c.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={16} color="#666" />
              <Text style={styles.detailText}>{c.phoneNumber}</Text>
            </View>

            {/* Blood Types */}
            <Text style={styles.sectionTitle}>Available Blood Types</Text>
            <View style={styles.chipContainer}>
              {c.availableBloodTypes.length
                ? c.availableBloodTypes.map(bt => (
                    <View key={bt} style={styles.chipAvailable}>
                      <Text style={styles.chipText}>{bt}</Text>
                    </View>
                  ))
                : <Text style={styles.noneText}>None</Text>
              }
            </View>

            <Text style={styles.sectionTitle}>Needed Blood Types</Text>
            <View style={styles.chipContainer}>
              {c.neededBloodTypes.length
                ? c.neededBloodTypes.map(bt => (
                    <View key={bt} style={styles.chipNeeded}>
                      <Text style={styles.chipText}>{bt}</Text>
                    </View>
                  ))
                : <Text style={styles.noneText}>None</Text>
              }
            </View>
          </TouchableOpacity>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.noResults}>No centers match your search.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 12, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B71C1C', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  list: { paddingHorizontal: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1 },
  status: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, color: '#666' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  detailText: { marginLeft: 8, color: '#666', flex: 1 },
  sectionTitle: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#333' },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  chipAvailable: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipNeeded: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: { fontSize: 12, color: '#333' },
  noneText: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  noResults: { textAlign: 'center', color: '#666', marginTop: 20 },
});
