"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function RequestBloodScreen({ navigation }) {
  const [requestType, setRequestType] = useState("")
  const [patientName, setPatientName] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [unitsNeeded, setUnitsNeeded] = useState("")
  const [urgency, setUrgency] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [reason, setReason] = useState("")
  const [isEmergency, setIsEmergency] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const apiUrl = process.env.EXPO_PUBLIC_API_URL
  const requestTypes = ["Individual", "Hospital"]
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const urgencyLevels = ["Normal", "Urgent", "Emergency"]
  const unitOptions = ["1", "2", "3", "4", "5", "6+"]

  const handleRequestSubmit = async () => {
    // Validate required fields
    if (!requestType || !bloodType || !unitsNeeded || !urgency || !contactPhone) {
      Alert.alert("Missing Information", "Please fill in all required fields to submit your request.")
      return
    }
    if (requestType === "Individual" && !patientName) {
      Alert.alert("Missing Information", "Please enter the patient's name for an individual request.")
      return
    }
    if (requestType === "Hospital" && !hospitalName) {
      Alert.alert("Missing Information", "Please enter the hospital name for a hospital request.")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        requestType,
        patientName: requestType === "Individual" ? patientName : undefined,
        hospitalName: requestType === "Hospital" ? hospitalName : undefined,
        bloodType,
        unitsNeeded: Number.parseInt(unitsNeeded, 10),
        urgency,
        contactPhone,
        reason,
      }

      Alert.alert(
        "Request Submitted!",
        `Your ${urgency.toLowerCase()} blood request has been submitted. We’ll contact you at ${contactPhone}.`,
        [{ text: "OK" }],
      )
      // Reset form
      setRequestType("")
      setPatientName("")
      setHospitalName("")
      setBloodType("")
      setUnitsNeeded("")
      setUrgency("")
      setContactPhone("")
      setReason("")
      setIsEmergency(false)
    } catch (err) {
      console.error(err)
      Alert.alert("Submission Failed", err.response?.data?.message || "There was an issue submitting your request.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmergencyToggle = () => {
    setIsEmergency((prev) => !prev)
    if (!isEmergency) {
      setUrgency("Emergency")
    } else {
      // If toggling off emergency, reset urgency to Normal or previous if applicable
      setUrgency("Normal")
    }
  }

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
            <Text style={styles.title}>Request Blood</Text>
            <Text style={styles.subtitle}>Submit a request to get the blood you need.</Text>
          </View>

          {/* Emergency Banner */}
          {isEmergency && (
            <View style={styles.emergencyBanner}>
              <Ionicons name="warning" size={24} color="#fff" />
              <Text style={styles.emergencyText}>EMERGENCY REQUEST - Priority Processing</Text>
            </View>
          )}

          {/* Request Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Blood Request Form</Text>

            <Text style={styles.label}>Request Type</Text>
            <View style={styles.typeContainer}>
              {requestTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, requestType === type && styles.typeButtonActive]}
                  onPress={() => setRequestType(type)}
                >
                  <Text style={[styles.typeText, requestType === type && styles.typeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {requestType === "Individual" && (
              <TextInput
                style={styles.input}
                placeholder="Patient Name *"
                value={patientName}
                onChangeText={setPatientName}
                placeholderTextColor="#9ca3af"
              />
            )}
            {requestType === "Hospital" && (
              <TextInput
                style={styles.input}
                placeholder="Hospital Name *"
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholderTextColor="#9ca3af"
              />
            )}

            <Text style={styles.label}>Blood Type Required</Text>
            <View style={styles.bloodTypeContainer}>
              {bloodTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.bloodTypeButton, bloodType === type && styles.bloodTypeButtonActive]}
                  onPress={() => setBloodType(type)}
                >
                  <Text style={[styles.bloodTypeText, bloodType === type && styles.bloodTypeTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Units Needed</Text>
            <View style={styles.unitsContainer}>
              {unitOptions.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[styles.unitButton, unitsNeeded === unit && styles.unitButtonActive]}
                  onPress={() => setUnitsNeeded(unit)}
                >
                  <Text style={[styles.unitText, unitsNeeded === unit && styles.unitTextActive]}>{unit}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Urgency Level</Text>
            <View style={styles.urgencyContainer}>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.urgencyButton, urgency === level && styles.urgencyButtonActive]}
                  onPress={() => setUrgency(level)}
                >
                  <Text style={[styles.urgencyText, urgency === level && styles.urgencyTextActive]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Contact Phone Number *"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              style={[styles.input, styles.reasonInput]}
              placeholder="Reason for Request (Optional)"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
            />

            <TouchableOpacity style={styles.emergencyToggle} onPress={handleEmergencyToggle}>
              <Ionicons
                name={isEmergency ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isEmergency ? "#dc2626" : "#6b7280"}
              />
              <Text style={styles.emergencyToggleText}>Mark as Emergency Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleRequestSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Blood Request</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Request Processing Times</Text>
            <Text style={styles.cardText}>
              • Emergency: 30 minutes{"\n"}• Urgent: 2 hours{"\n"}• Normal: 24 hours{"\n"}• We will contact you at the
              provided phone number
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    position: "relative",
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
  },
  reasonInput: {
    minHeight: 100, // Larger height for multiline input
    paddingTop: 15, // Ensure text starts from the top
  },
  emergencyBanner: {
    backgroundColor: "#ef4444", // Stronger red for emergency
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
    textTransform: "uppercase",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f9fafb",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  typeTextActive: {
    color: "#ffffff",
    fontWeight: "700",
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
  bloodTypeText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  bloodTypeTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  unitsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  unitButton: {
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
  unitButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  unitText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  unitTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  urgencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  urgencyButton: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f9fafb",
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  urgencyButtonActive: {
    backgroundColor: "#dc2626",
    borderColor: "#dc2626",
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  urgencyText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  urgencyTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  emergencyToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  emergencyToggleText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 10,
    fontWeight: "500",
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
})
