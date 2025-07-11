import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Mock data for blood donation centers
  const centers = [
    {
      id: 1,
      name: 'Red Cross Blood Center',
      address: '123 Main Street, Downtown',
      phone: '(555) 123-4567',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      distance: '0.5 miles',
      rating: 4.8,
      available: true,
    },
    {
      id: 2,
      name: 'City Hospital Blood Bank',
      address: '456 Oak Avenue, Medical District',
      phone: '(555) 987-6543',
      hours: 'Mon-Sun: 24/7',
      distance: '1.2 miles',
      rating: 4.6,
      available: true,
    },
    {
      id: 3,
      name: 'Community Blood Services',
      address: '789 Pine Street, Westside',
      phone: '(555) 456-7890',
      hours: 'Mon-Fri: 9AM-5PM',
      distance: '2.1 miles',
      rating: 4.4,
      available: false,
    },
    {
      id: 4,
      name: 'Emergency Blood Center',
      address: '321 Elm Road, Eastside',
      phone: '(555) 321-0987',
      hours: 'Mon-Sun: 24/7',
      distance: '3.5 miles',
      rating: 4.9,
      available: true,
    },
  ];

  const filteredCenters = centers.filter(center =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCenterPress = (center) => {
    setSelectedCenter(center);
    Alert.alert(
      center.name,
      `Address: ${center.address}\nPhone: ${center.phone}\nHours: ${center.hours}\nDistance: ${center.distance}`,
      [
        { text: 'Call', onPress: () => console.log('Calling center...') },
        { text: 'Get Directions', onPress: () => console.log('Getting directions...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEmergencyRequest = () => {
    Alert.alert(
      'Emergency Blood Request',
      'This will notify all nearby centers of your urgent blood need. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Request', onPress: () => {
          Alert.alert('Request Sent', 'Nearby centers have been notified of your emergency blood request.');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="map" size={40} color="#B71C1C" />
        <Text style={styles.title}>Find Blood Centers</Text>
        <Text style={styles.subtitle}>Locate nearby donation centers</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by location or center name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.emergencyContainer}>
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyRequest}>
          <Ionicons name="warning" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>Emergency Blood Request</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.centersList}>
        {filteredCenters.map((center) => (
          <TouchableOpacity
            key={center.id}
            style={styles.centerCard}
            onPress={() => handleCenterPress(center)}
          >
            <View style={styles.centerHeader}>
              <Text style={styles.centerName}>{center.name}</Text>
              <View style={styles.centerStatus}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: center.available ? '#4CAF50' : '#F44336' }
                ]} />
                <Text style={styles.statusText}>
                  {center.available ? 'Available' : 'Unavailable'}
                </Text>
              </View>
            </View>
            
            <View style={styles.centerDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.detailText}>{center.address}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="call" size={16} color="#666" />
                <Text style={styles.detailText}>{center.phone}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="time" size={16} color="#666" />
                <Text style={styles.detailText}>{center.hours}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="navigate" size={16} color="#666" />
                <Text style={styles.detailText}>{center.distance}</Text>
              </View>
            </View>
            
            <View style={styles.centerFooter}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{center.rating}</Text>
              </View>
              
              <TouchableOpacity style={styles.directionsButton}>
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  emergencyContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  centersList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  centerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  centerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  centerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  directionsButton: {
    backgroundColor: '#B71C1C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 