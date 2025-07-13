"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,   
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  StatusBar,
} from "react-native"
import axios from "axios"
import DateTimePicker from "@react-native-community/datetimepicker"

export default function DonationScreen({ navigation }) {  
  // Form state
  const [medicalCenter, setMedicalCenter] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [donationDate, setDonationDate] = useState(new Date())

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showCenterModal, setShowCenterModal] = useState(false)

  // Data state
  const [centers, setCenters] = useState([])
  const [loadingCenters, setLoadingCenters] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const apiUrl = process.env.EXPO_PUBLIC_API_URL // e.g. http://192.168.0.100:4000/api
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  // Fetch centers once on component mount
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const resp = await axios.get(`${apiUrl}/centers/all`)
        setCenters(resp.data)
      } catch (err) {
        console.error(err)
        Alert.alert("Error", "Could not load medical centers. Please try again later.")
      } finally {
        setLoadingCenters(false)
      }
    }
    fetchCenters()
  }, [])

  const handleDonationSubmit = async () => {
    if (!medicalCenter || !bloodType || !donationDate) {
      Alert.alert("Missing Information", "Please fill in all required fields to schedule your donation.")
      return
    }

    // Ensure date is today or future
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const selected = new Date(donationDate)
    selected.setHours(0, 0, 0, 0)
    if (selected < now) {
      Alert.alert("Invalid Date", "Please choose today or a future date for your donation.")
      return
    }

    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // In a real app, you'd send data to your backend here
      // await axios.post(`${apiUrl}/donations/schedule`, { medicalCenter, bloodType, donationDate });

      Alert.alert(
        "Donation Scheduled!",
        `Thank you for scheduling your donation for ${donationDate.toLocaleDateString()} at ${
          centers.find((c) => c._id === medicalCenter)?.name
        }. Your contribution saves lives!`,
      )
      // Reset form
      setMedicalCenter("")
      setBloodType("")
      setDonationDate(new Date())
    } catch (error) {
      console.error("Donation submission error:", error)
      Alert.alert("Submission Failed", "There was an issue scheduling your donation. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCenterName = medicalCenter
    ? centers.find((c) => c._id === medicalCenter)?.name || "Select a center"
    : "Select a center"

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>♥</Text>
            </View>
            <Text style={styles.appName}>LifeShare</Text>
            <Text style={styles.title}>Schedule Your Donation</Text>
            <Text style={styles.subtitle}>Your generosity can save lives. Thank you for being a hero!</Text>
          </View>

          {/* Why Donate Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Why Donate Blood?</Text>
            <Text style={styles.cardText}>
              • One donation can save up to 3 lives{"\n"}• Blood is needed every 2 seconds{"\n"}• Only 3% of eligible
              people donate{"\n"}• Your donation is crucial for emergency care
            </Text>
          </View>

          {/* Donation Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Donation Details</Text>

            <Text style={styles.label}>Medical Center</Text>
            {loadingCenters ? (
              <ActivityIndicator color="#dc2626" size="large" style={styles.loadingIndicator} />
            ) : (
              <TouchableOpacity style={styles.input} onPress={() => setShowCenterModal(true)}>
                <Text style={medicalCenter ? styles.inputText : styles.placeholderText}>{selectedCenterName}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.label}>Blood Type</Text>
            <View style={styles.bloodTypeContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.bloodTypeButton, bloodType === type && styles.bloodTypeButtonActive]}
                  onPress={() => setBloodType(type)}
                >
                  <Text style={[styles.bloodTypeButtonText, bloodType === type && styles.bloodTypeButtonTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Preferred Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.inputText}>{donationDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={donationDate}
                mode="date"
                display="calendar"
                minimumDate={new Date()}
                textColor="#dc2626"
                accentColor="#dc2626"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) setDonationDate(selectedDate)
                }}
              />
            )}

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleDonationSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Schedule Donation</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Requirements Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Donation Requirements</Text>
            <Text style={styles.cardText}>
              • Age 16+ with parental consent{"\n"}• Weight at least 110 lbs{"\n"}• Good general health{"\n"}• No recent
              tattoos or piercings{"\n"}• Not pregnant or recently pregnant
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Medical Center Selection Modal */}
      <Modal
        visible={showCenterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCenterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Medical Center</Text>
            {loadingCenters ? (
              <ActivityIndicator color="#dc2626" size="large" />
            ) : (
              <FlatList
                data={centers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setMedicalCenter(item._id)
                      setShowCenterModal(false)
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                    <Text style={styles.modalItemAddress}>{item.address}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.modalItemSeparator} />}
              />
            )}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowCenterModal(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8", // Light background color
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Extra padding for scroll
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: "#dc2626",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#dc2626",
    marginBottom: 15,
    textAlign: "center",
  },
  cardText: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#f9fafb",
    fontSize: 16,
    color: "#111827",
    marginBottom: 15,
    justifyContent: "center", // For text alignment in TouchableOpacity
    minHeight: 50, // Ensure consistent height
  },
  inputText: {
    fontSize: 16,
    color: "#111827",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  bloodTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  bloodTypeButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: "23%", // Approx 4 items per row with spacing
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  bloodTypeButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bloodTypeButtonText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  bloodTypeButtonTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  modalItemText: {
    fontSize: 17,
    color: "#111827",
    fontWeight: "600",
  },
  modalItemAddress: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  modalItemSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 5,
  },
  modalCloseButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  modalCloseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
