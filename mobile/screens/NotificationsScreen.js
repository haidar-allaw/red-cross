import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const getUserIdFromToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return null;
    console.log('as', token);
    console.log(token);

    try {
        const decoded = jwtDecode(token);
        return decoded.id;
    } catch (e) {
        return null;
    }
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const userId = await getUserIdFromToken();
            const { data } = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications?userId=${'68708d3858425eb3f31c1a47'}`);
            console.log(data);

            setNotifications(data);
        } catch (err) {
            Alert.alert('Error', 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const clearAllNotifications = async () => {
        try {
            const userId = await getUserIdFromToken();
            if (!userId) throw new Error('User ID not found');
            await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/notifications/clear-all?userId=${userId}`);
            fetchNotifications();
        } catch (err) {
            Alert.alert('Error', 'Failed to clear notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#B71C1C" />
            ) : notifications.length === 0 ? (
                <Text style={styles.info}>No notifications</Text>
            ) : (
                <>
                    <FlatList
                        data={notifications}
                        keyExtractor={item => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.notification}>
                                <Text style={styles.message}>{item.message}</Text>
                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                            </View>
                        )}
                    />
                    <TouchableOpacity style={styles.clearButton} onPress={clearAllNotifications}>
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', color: '#B71C1C', marginBottom: 16 },
    info: { textAlign: 'center', color: '#888', marginTop: 32 },
    notification: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    message: { fontSize: 16, color: '#333' },
    date: { fontSize: 12, color: '#888', marginTop: 4 },
    clearButton: { marginTop: 16, alignSelf: 'center', backgroundColor: '#B71C1C', padding: 10, borderRadius: 8 },
    clearButtonText: { color: '#fff', fontWeight: 'bold' },
}); 