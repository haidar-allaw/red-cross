// SignupScreen.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LogBox } from 'react-native';

// Suppress VirtualizedList warning
LogBox.ignoreLogs([ 'VirtualizedLists should never be nested' ]);

export default function SignupScreen({ navigation }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodtype, setBloodtype] = useState('');
  const [address, setAddress] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'O-', value: 'O-'},
    {label: 'O+', value: 'O+'},
    {label: 'A-', value: 'A-'},
    {label: 'A+', value: 'A+'},
    {label: 'B-', value: 'B-'},
    {label: 'B+', value: 'B+'},
    {label: 'AB-', value: 'AB-'},
    {label: 'AB+', value: 'AB+'},
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const signupData = {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      bloodtype,
      address,
      role: 'user',
    };

    try {
      await axios.post(`${apiUrl}/users/signup`, signupData);
      setSuccess('Signup successful! Redirecting...');
      // Navigate to Dashboard
      navigation.replace('Dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Signup failed';
      if (errorMessage.toLowerCase().includes('email')) {
        setError('This email is already registered. Please use a different email address.');
      } else if (errorMessage.toLowerCase().includes('phone')) {
        setError('This phone number is already registered. Please use a different phone number.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = setter => value => {
    setter(value);
    if (error) setError('');
    if (success) setSuccess('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={20}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={handleFieldChange(setFirstname)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={handleFieldChange(setLastname)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={handleFieldChange(setEmail)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={handleFieldChange(setPassword)}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={handleFieldChange(setPhoneNumber)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Blood Type (optional)</Text>
          <DropDownPicker
            open={open}
            value={bloodtype}
            items={items}
            setOpen={setOpen}
            setValue={setBloodtype}
            setItems={setItems}
            placeholder="Select your blood type"
            style={styles.input}
            containerStyle={styles.dropdownContainer}
            listMode="MODAL"
            modalTitle="Select Blood Type"
            modalContentContainerStyle={styles.modalContent}
            modalTitleStyle={styles.modalTitle}
            dropDownContainerStyle={styles.dropDownBox}
            textStyle={styles.pickerText}
            placeholderStyle={styles.pickerPlaceholder}
            selectedItemLabelStyle={styles.selectedItem}
            itemSeparator
            itemSeparatorStyle={{ backgroundColor: '#eee' }}
          />

          <TextInput
            style={styles.input}
            placeholder="Address (optional)"
            value={address}
            onChangeText={handleFieldChange(setAddress)}
          />

          <Button
            title={loading ? 'Signing up...' : 'Sign Up'}
            onPress={handleSignup}
            disabled={loading}
          />
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { justifyContent: 'center', alignItems: 'center', paddingVertical: 32, backgroundColor: '#fff' },
  container: { width: '100%', maxWidth: 400, alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#B71C1C' },
  input: { width: '100%', maxWidth: 320, height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 12, fontSize: 16, backgroundColor: '#fafafa' },
  dropdownContainer: { width: '100%', maxWidth: 320, alignSelf: 'center', marginBottom: 16 },
  label: { alignSelf: 'flex-start', marginLeft: 8, marginBottom: 4, fontWeight: 'bold', color: '#B71C1C', fontSize: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontWeight: 'bold', fontSize: 18, color: '#B71C1C', marginBottom: 8 },
  dropDownBox: { borderColor: '#B71C1C', borderWidth: 1, borderRadius: 8 },
  pickerText: { fontSize: 16, color: '#333' },
  pickerPlaceholder: { color: '#aaa', fontStyle: 'italic' },
  selectedItem: { fontWeight: 'bold', color: '#B71C1C' },
  error: { color: '#B71C1C', marginBottom: 12, fontWeight: 'bold', textAlign: 'center', maxWidth: 320 },
  success: { color: 'green', marginBottom: 12, fontWeight: 'bold', textAlign: 'center', maxWidth: 320 }
});