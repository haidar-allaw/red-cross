// RequestBloodScreen.jsx

import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function RequestBloodScreen() {
  const [requestType, setRequestType] = useState("");
  const [patientName, setPatientName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState("");
  const [urgency, setUrgency] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [reason, setReason] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const requestTypes = ["Individual", "Hospital"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const urgencyLevels = ["Normal", "Urgent", "Emergency"];
  const unitOptions = ["1", "2", "3", "4", "5", "6+"];

  const handleRequestSubmit = async () => {
    // Validate required
    if (!requestType || !bloodType || !unitsNeeded || !urgency || !contactPhone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (requestType === "Individual" && !patientName) {
      Alert.alert("Error", "Please enter patient name");
      return;
    }
    if (requestType === "Hospital" && !hospitalName) {
      Alert.alert("Error", "Please enter hospital name");
      return;
    }

    try {
      const payload = {
        requestType,
        patientName: requestType === "Individual" ? patientName : undefined,
        hospitalName: requestType === "Hospital" ? hospitalName : undefined,
        bloodType,
        unitsNeeded: parseInt(unitsNeeded, 10),
        urgency,
        contactPhone,
        reason,
      };

      // POST to /api/bloodRequest
      await axios.post(
        `${apiUrl}/bloodrequests/create`,
        payload
      );

      Alert.alert(
        "Success",
        `Your ${urgency.toLowerCase()} request has been submitted! We’ll contact you at ${contactPhone}.`,
        [{ text: "OK" }]
      );

      // reset
      setRequestType("");
      setPatientName("");
      setHospitalName("");
      setBloodType("");
      setUnitsNeeded("");
      setUrgency("");
      setContactPhone("");
      setReason("");
      setIsEmergency(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Submission failed");
    }
  };

  const handleEmergencyToggle = () => {
    setIsEmergency(!isEmergency);
    if (!isEmergency) setUrgency("Emergency");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="medical" size={50} color="#B71C1C" />
          <Text style={styles.title}>Request Blood</Text>
          <Text style={styles.subtitle}>Get the blood you need</Text>
        </View>

        {isEmergency && (
          <View style={styles.emergencyBanner}>
            <Ionicons name="warning" size={24} color="#fff" />
            <Text style={styles.emergencyText}>
              EMERGENCY REQUEST - Priority Processing
            </Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Blood Request Form</Text>

          <Text style={styles.label}>Request Type *</Text>
          <View style={styles.typeContainer}>
            {requestTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  requestType === type && styles.typeButtonActive,
                ]}
                onPress={() => setRequestType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    requestType === type && styles.typeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {requestType === "Individual" && (
            <TextInput
              style={styles.input}
              placeholder="Patient Name *"
              value={patientName}
              onChangeText={setPatientName}
            />
          )}
          {requestType === "Hospital" && (
            <TextInput
              style={styles.input}
              placeholder="Hospital Name *"
              value={hospitalName}
              onChangeText={setHospitalName}
            />
          )}

          <Text style={styles.label}>Blood Type Required *</Text>
          <View style={styles.bloodTypeContainer}>
            {bloodTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.bloodTypeButton,
                  bloodType === type && styles.bloodTypeButtonActive,
                ]}
                onPress={() => setBloodType(type)}
              >
                <Text
                  style={[
                    styles.bloodTypeText,
                    bloodType === type && styles.bloodTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Units Needed *</Text>
          <View style={styles.unitsContainer}>
            {unitOptions.map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitButton,
                  unitsNeeded === unit && styles.unitButtonActive,
                ]}
                onPress={() => setUnitsNeeded(unit)}
              >
                <Text
                  style={[
                    styles.unitText,
                    unitsNeeded === unit && styles.unitTextActive,
                  ]}
                >
                  {unit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Urgency Level *</Text>
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.urgencyButton,
                  urgency === level && styles.urgencyButtonActive,
                ]}
                onPress={() => setUrgency(level)}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === level && styles.urgencyTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Contact Phone Number *"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Reason for Request (Optional)"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.emergencyToggle}
            onPress={handleEmergencyToggle}
          >
            <Ionicons
              name={isEmergency ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={isEmergency ? "#F44336" : "#666"}
            />
            <Text style={styles.emergencyToggleText}>
              Mark as Emergency Request
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRequestSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Blood Request</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Request Processing Times</Text>
          <Text style={styles.infoText}>
            • Emergency: 30 minutes{"\n"}• Urgent: 2 hours{"\n"}• Normal: 24 hours{"\n"}• We will contact you at the provided phone number
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  scrollContainer: { padding: 16 },
  header: { alignItems: "center", marginBottom: 24, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#B71C1C", marginTop: 12 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4 },
  emergencyBanner: {
    backgroundColor: "#F44336",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emergencyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  typeContainer: { flexDirection: "row", marginBottom: 8 },
  typeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: "#fafafa",
    flex: 1,
  },
  typeButtonActive: { backgroundColor: "#B71C1C", borderColor: "#B71C1C" },
  typeText: { fontSize: 14, color: "#666", textAlign: "center" },
  typeTextActive: { color: "#fff", fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  bloodTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  bloodTypeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
    width: "22%",
  },
  bloodTypeButtonActive: { backgroundColor: "#B71C1C", borderColor: "#B71C1C" },
  bloodTypeText: { fontSize: 14, color: "#666", textAlign: "center" },
  bloodTypeTextActive: { color: "#fff", fontWeight: "bold" },
  unitsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  unitButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
    width: "22%",
  },
  unitButtonActive: { backgroundColor: "#B71C1C", borderColor: "#B71C1C" },
  unitText: { fontSize: 14, color: "#666", textAlign: "center" },
  unitTextActive: { color: "#fff", fontWeight: "bold" },
  urgencyContainer: { flexDirection: "row", marginBottom: 8 },
  urgencyButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    backgroundColor: "#fafafa",
    flex: 1,
  },
  urgencyButtonActive: { backgroundColor: "#B71C1C", borderColor: "#B71C1C" },
  urgencyText: { fontSize: 14, color: "#666", textAlign: "center" },
  urgencyTextActive: { color: "#fff", fontWeight: "bold" },
  emergencyToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 8,
  },
  emergencyToggleText: { fontSize: 16, color: "#666", marginLeft: 8 },
  submitButton: {
    backgroundColor: "#B71C1C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 8,
  },
  infoText: { fontSize: 14, color: "#666", lineHeight: 20 },
});
