import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DonationScreen() {
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [donationDate, setDonationDate] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleDonationSubmit = () => {
    if (!donorName || !donorPhone || !bloodType || !donationDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert(
      'Donation Request Submitted',
      'Thank you for your interest in donating blood. We will contact you soon to schedule your donation appointment.',
      [{ text: 'OK' }]
    );
    
    // Reset form
    setDonorName('');
    setDonorPhone('');
    setBloodType('');
    setDonationDate('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="heart" size={50} color="#B71C1C" />
          <Text style={styles.title}>Donate Blood</Text>
          <Text style={styles.subtitle}>Save Lives Today</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Donate Blood?</Text>
          <Text style={styles.infoText}>
            • One donation can save up to 3 lives{'\n'}
            • Blood is needed every 2 seconds{'\n'}
            • Only 3% of eligible people donate{'\n'}
            • Your donation is crucial for emergency care
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Schedule Your Donation</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={donorName}
            onChangeText={setDonorName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={donorPhone}
            onChangeText={setDonorPhone}
            keyboardType="phone-pad"
          />
          
          <Text style={styles.label}>Blood Type</Text>
          <View style={styles.bloodTypeContainer}>
            {bloodTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.bloodTypeButton,
                  bloodType === type && styles.bloodTypeButtonActive
                ]}
                onPress={() => setBloodType(type)}
              >
                <Text style={[
                  styles.bloodTypeText,
                  bloodType === type && styles.bloodTypeTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Preferred Donation Date (MM/DD/YYYY)"
            value={donationDate}
            onChangeText={setDonationDate}
          />
          
          <TouchableOpacity style={styles.submitButton} onPress={handleDonationSubmit}>
            <Text style={styles.submitButtonText}>Schedule Donation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Donation Requirements</Text>
          <Text style={styles.requirementsText}>
            • Age 16+ with parental consent{'\n'}
            • Weight at least 110 lbs{'\n'}
            • Good general health{'\n'}
            • No recent tattoos or piercings{'\n'}
            • Not pregnant or recently pregnant
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  bloodTypeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  bloodTypeButtonActive: {
    backgroundColor: '#B71C1C',
    borderColor: '#B71C1C',
  },
  bloodTypeText: {
    fontSize: 14,
    color: '#666',
  },
  bloodTypeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#B71C1C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  requirementsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B71C1C',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 