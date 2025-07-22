// NotificationsScreen.jsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // Helper to get token
  const getToken = async () => {
    return AsyncStorage.getItem("userToken");
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not found, please login again");

      const { data } = await axios.get(
        `${apiUrl}/notifications?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      Alert.alert("Error", err.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  const clearAllNotifications = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const userId = await AsyncStorage.getItem("userId"); 
      if (!userId) throw new Error("User not found, please login again");

      await axios.delete(`${apiUrl}/notifications/clear-all?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error("Clear notifications error:", err);
      Alert.alert("Error", err.message || "Could not clear notifications");
      setLoading(false);
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
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.notification}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 16,
  },
  info: { textAlign: "center", color: "#888", marginTop: 32 },
  notification: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  message: { fontSize: 16, color: "#333" },
  date: { fontSize: 12, color: "#888", marginTop: 4 },
  clearButton: {
    marginTop: 16,
    alignSelf: "center",
    backgroundColor: "#B71C1C",
    padding: 10,
    borderRadius: 8,
  },
  clearButtonText: { color: "#fff", fontWeight: "bold" },
});
