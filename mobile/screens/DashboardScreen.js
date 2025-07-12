import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import the individual screen components
import DonationScreen from './DonationScreen';
import MapScreen from './MapScreen';
import RequestBloodScreen from './RequestBloodScreen';

const Tab = createBottomTabNavigator();

export default function DashboardScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Donation') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Request') {
            iconName = focused ? 'medical' : 'medical-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#B71C1C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: '#B71C1C',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Donation" 
        component={DonationScreen}
        options={{
          title: 'Donate Blood',
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          title: 'Find Centers',
        }}
      />
      <Tab.Screen 
        name="Request" 
        component={RequestBloodScreen}
        options={{
          title: 'Request Blood',
        }}
      />
    </Tab.Navigator>
  );
} 