import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/centers/all`);
        setCenters(data.filter((c) => c.isApproved));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openOnMap = (center) => {
    navigation.navigate('HospitalMap', {
      lat: center.location?.lat ?? center.lat,
      lng: center.location?.lng ?? center.lng,
      name: center.name,
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loaderText}>Loading centers...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <KeyboardAvoidingView
        style={styles.fullScreenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>♥</Text>
            </View>
            <Text style={styles.appName}>LifeShare</Text>
            <Text style={styles.title}>Find Donation Centers</Text>
            <Text style={styles.subtitle}>
              Locate nearby blood donation centers and check their needs.
            </Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#6b7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or address..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* List */}
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
              <TouchableOpacity
                key={center._id}
                style={styles.card}
                onPress={() => openOnMap(center)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{center.name}</Text>
                  <View style={styles.status}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            Array.isArray(center.availableBloodTypes) &&
                            center.availableBloodTypes.length
                              ? '#22c55e'
                              : '#ef4444',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            Array.isArray(center.availableBloodTypes) &&
                            center.availableBloodTypes.length
                              ? '#22c55e'
                              : '#ef4444',
                        },
                      ]}
                    >
                      {Array.isArray(center.availableBloodTypes) &&
                      center.availableBloodTypes.length
                        ? 'In Stock'
                        : 'Out of Stock'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color="#6b7280" />
                  <Text style={styles.detailText}>{center.address}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>
              No centers found matching your search.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: { marginTop: 10, fontSize: 16, color: '#4b5563' },
  fullScreenContainer: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContentContainer: { paddingBottom: 20 },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: '#dc2626',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
  },
  logoText: { color: '#fff', fontSize: 30, fontWeight: '700' },
  appName: { fontSize: 28, fontWeight: '800', color: '#111827' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 3,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#111827' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 19, fontWeight: '700', color: '#111827' },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  statusText: { fontSize: 13, fontWeight: '600' },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  detailText: { marginLeft: 10, color: '#4b5563', fontSize: 15, flex: 1 },
  noResults: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    marginTop: 40,
  },
});
