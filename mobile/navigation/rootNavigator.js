import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import DonationScreen from '../screens/DonationScreen';
import MapScreen from '../screens/MapScreen';
import RequestBloodScreen from '../screens/RequestBloodScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HospitalMapScreen from '../screens/HospitalMapScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
     <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Donate') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Request') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Hospitals') {
            iconName = focused ? 'medkit' : 'medkit-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#B71C1C',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          height: 55 + insets.bottom,
          paddingBottom: 5 + insets.bottom,
        },
        headerStyle: { backgroundColor: '#B71C1C' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#fff"
            style={{ marginRight: 18 }}
            onPress={() => navigation.navigate('Notifications')}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Donate"
        component={DonationScreen}
        options={{ title: 'Donate Blood' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Find Centers' }}
      />
      <Tab.Screen
        name="Hospitals"
        component={HospitalMapScreen}
        options={{ title: 'Hospitals' }}
      />
      <Tab.Screen
        name="Request"
        component={RequestBloodScreen}
        options={{ title: 'Request Blood' }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HospitalMap"
          component={HospitalMapScreen}
          options={{
            title: 'Center Location',
            headerStyle: { backgroundColor: '#B71C1C' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            title: 'Notifications',
            headerStyle: { backgroundColor: '#B71C1C' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
