"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"

export default function MapScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [centers, setCenters] = useState([])
  const [loading, setLoading] = useState(true)
  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/centers/all`)
        setCenters(data.filter((c) => c.isApproved))
      } catch (err) {
        console.error(err)
        Alert.alert("Error", "Could not load medical centers. Please check your internet connection.")
      } finally {
        setLoading(false)
      }
    }
    fetchCenters()
  }, [])

  const filteredCenters = centers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const showDetails = (center) => {
    Alert.alert(center.name, `Address: ${center.address}\nEmail: ${center.email}\nPhone: ${center.phoneNumber}`, [
      { text: "OK" },
    ])
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loaderText}>Loading centers...</Text>
      </View>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <KeyboardAvoidingView style={styles.fullScreenContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>♥</Text>
            </View>
            <Text style={styles.appName}>LifeShare</Text>
            <Text style={styles.title}>Find Donation Centers</Text>
            <Text style={styles.subtitle}>Locate nearby blood donation centers and check their needs.</Text>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
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
              <TouchableOpacity key={center._id} style={styles.card} onPress={() => showDetails(center)}>
                {/* Name & Stock Status */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{center.name}</Text>
                  <View style={styles.status}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: center.availableBloodTypes.length ? "#22c55e" : "#ef4444" }, // Green for in stock, Red for out of stock
                      ]}
                    />
                    <Text
                      style={[styles.statusText, { color: center.availableBloodTypes.length ? "#22c55e" : "#ef4444" }]}
                    >
                      {center.availableBloodTypes.length ? "In Stock" : "Out of Stock"}
                    </Text>
                  </View>
                </View>

                {/* Contact Info */}
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={18} color="#6b7280" />
                  <Text style={styles.detailText}>{center.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="mail-outline" size={18} color="#6b7280" />
                  <Text style={styles.detailText}>{center.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={18} color="#6b7280" />
                  <Text style={styles.detailText}>{center.phoneNumber}</Text>
                </View>

                {/* Blood Types */}
                <Text style={styles.sectionTitle}>Available Blood Types</Text>
                <View style={styles.chipContainer}>
                  {center.availableBloodTypes.length > 0 ? (
                    center.availableBloodTypes.map((bt) => (
                      <View key={bt} style={styles.chipAvailable}>
                        <Text style={styles.chipText}>{bt}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noneText}>None available</Text>
                  )}
                </View>

                <Text style={styles.sectionTitle}>Needed Blood Types</Text>
                <View style={styles.chipContainer}>
                  {center.neededBloodTypes.length > 0 ? (
                    center.neededBloodTypes.map((bt) => (
                      <View key={bt} style={styles.chipNeeded}>
                        <Text style={styles.chipText}>{bt}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noneText}>None needed</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>No centers found matching your search.</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4b5563",
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Light background color
  },
  scrollContentContainer: {
    paddingBottom: 20, // Ensure space at the bottom
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20, // Add margin bottom to separate from search bar
  },
  logo: {
    width: 70, // Increased from 60
    height: 70, // Increased from 60
    backgroundColor: "#dc2626",
    borderRadius: 35, // Half of width/height
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16, // Increased from 12
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 }, // Increased shadow
    shadowOpacity: 0.3,
    shadowRadius: 8, // Increased shadow
    elevation: 5,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 30, // Increased from 28
    fontWeight: "700",
  },
  appName: {
    fontSize: 28, // Increased from 24
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8, // Increased from 6
  },
  title: {
    fontSize: 26, // Increased from 22
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15, // Increased from 14
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22, // Increased from 20
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20, // Add margin bottom to separate from list
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20, // Apply horizontal margin here for cards
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 10,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4", // Light green background for status
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailText: {
    marginLeft: 10,
    color: "#4b5563",
    fontSize: 15,
    flex: 1,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chipAvailable: {
    backgroundColor: "#ecfdf5", // Very light green
    borderColor: "#a7f3d0", // Light green border
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipNeeded: {
    backgroundColor: "#fef2f2", // Very light red
    borderColor: "#fecaca", // Light red border
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  noneText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
    paddingVertical: 5,
  },
  noResults: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginTop: 40,
    paddingHorizontal: 20,
  },
})
