import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import axios from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('=== LOGIN PROCESS STARTED ===');
    console.log('Login Form Data:', {
      email,
      password: '***hidden***'
    });
    
    setLoading(true);
    setError('');
    
    const loginData = {
      email,
      password,
    };
    
    console.log('API URL:', 'http://localhost:4000/api/users/login');
    console.log('Request Payload:', JSON.stringify({ ...loginData, password: '***hidden***' }, null, 2));
    
    try {
      console.log('Sending login request...');
      const response = await axios.post('http://localhost:4000/api/users/login', loginData);
      
      console.log('=== LOGIN SUCCESS ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('User Token:', response.data.token ? '***token received***' : 'No token');
      console.log('User Info:', response.data.user);
      
      Alert.alert('Login Successful', `Welcome, ${response.data.user.firstname}!`);
      console.log('Login alert shown to user');
      
      // TODO: Save token and navigate to the main app screen
      console.log('TODO: Save token and navigate to main screen');
      setError('');
    } catch (err) {
      console.log('=== LOGIN ERROR ===');
      console.log('Error Object:', err);
      console.log('Error Response:', err.response);
      console.log('Error Status:', err.response?.status);
      console.log('Error Data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      console.log('Error Message:', errorMessage);
      
      setError(errorMessage);
      console.log('Error message set in UI');
    } finally {
      console.log('Login process completed. Loading state set to false.');
      setLoading(false);
    }
  };

  // Clear error when user edits fields
  const handleEmailChange = (text) => {
    console.log('Email field changed:', text);
    setEmail(text);
    if (error) {
      console.log('Clearing error message due to email change');
      setError('');
    }
  };
  
  const handlePasswordChange = (text) => {
    console.log('Password field changed:', '***hidden***');
    setPassword(text);
    if (error) {
      console.log('Clearing error message due to password change');
      setError('');
    }
  };

  console.log('=== LOGIN SCREEN RENDER ===');
  console.log('Current State:', {
    loading,
    error: error || 'none',
    email: email || 'empty',
    password: password ? '***filled***' : 'empty'
  });

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Log In</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
              autoCorrect={false}
            />
            <Button title={loading ? 'Logging in...' : 'Log In'} onPress={handleLogin} disabled={loading} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    minHeight: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#B71C1C',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  error: {
    color: '#B71C1C',
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 320,
  },
}); 