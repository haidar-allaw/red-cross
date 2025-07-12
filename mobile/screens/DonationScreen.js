// DonationScreen.jsx

import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DonationScreen() {
  // form state
  const [medicalCenter, setMedicalCenter] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [donationDate, setDonationDate] = useState(new Date());

  // UI state for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // centers from backend
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL; // e.g. http://192.168.0.100:4000/api

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // fetch centers once
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(`${apiUrl}/centers/all`);
        setCenters(resp.data);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Could not load medical centers");
      } finally {
        setLoadingCenters(false);
      }
    })();
  }, []);

  const handleDonationSubmit = () => {
    if (!medicalCenter || !bloodType || !donationDate) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    // ensure date is today or future
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const selected = new Date(donationDate);
    selected.setHours(0, 0, 0, 0);
    if (selected < now) {
      Alert.alert("Error", "Please choose today or a future date");
      return;
    }

    // submit logic...
    Alert.alert(
      "Donation Request Submitted",
      `Scheduled for ${selected.toLocaleDateString()}. Thank you!`,
      [{ text: "OK" }]
    );

    // reset form
    setMedicalCenter("");
    setBloodType("");
    setDonationDate(new Date());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header & Info Card */}
        <View style={styles.header}>
          <Ionicons name="heart" size={50} color="#B71C1C" />
          <Text style={styles.title}>Donate Blood</Text>
          <Text style={styles.subtitle}>Save Lives Today</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why Donate Blood?</Text>
          <Text style={styles.infoText}>
            • One donation can save up to 3 lives{"\n"}• Blood is needed every 2
            seconds{"\n"}• Only 3% of eligible people donate{"\n"}• Your
            donation is crucial for emergency care
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Schedule Your Donation</Text>

          <Text style={styles.label}>Medical Center *</Text>
          {loadingCenters ? (
            <ActivityIndicator color="#B71C1C" />
          ) : (
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={medicalCenter}
                onValueChange={setMedicalCenter}
                mode="dropdown"
              >
                <Picker.Item label="-- Select a center --" value="" />
                {centers.map((c) => (
                  <Picker.Item key={c._id} label={c.name} value={c._id} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>Blood Type *</Text>
          <View style={styles.optionContainer}>
            {bloodTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  bloodType === type && styles.optionButtonActive,
                ]}
                onPress={() => setBloodType(type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    bloodType === type && styles.optionTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Preferred Date *</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {donationDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={donationDate}
              mode="date"
              display="calendar"
              minimumDate={new Date()}
              textColor="#B71C1C" 
              accentColor="#B71C1C" 
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDonationDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleDonationSubmit}
          >
            <Text style={styles.submitButtonText}>Schedule Donation</Text>
          </TouchableOpacity>
        </View>

        {/* Requirements Card */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Donation Requirements</Text>
          <Text style={styles.requirementsText}>
            • Age 16+ with parental consent{"\n"}• Weight at least 110 lbs{"\n"}
            • Good general health{"\n"}• No recent tattoos or piercings{"\n"}•
            Not pregnant or recently pregnant
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
  title: { fontSize: 28, fontWeight: "bold", color: "#B71C1C" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4 },

  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 8,
  },
  infoText: { fontSize: 14, color: "#666", lineHeight: 20 },

  formContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
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

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },

  optionContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  optionButtonActive: { backgroundColor: "#B71C1C", borderColor: "#B71C1C" },
  optionText: { fontSize: 14, color: "#666" },
  optionTextActive: { color: "#fff", fontWeight: "bold" },

  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  dateText: { fontSize: 16, color: "#333" },

  submitButton: {
    backgroundColor: "#B71C1C",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  requirementsCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 8,
  },
  requirementsText: { fontSize: 14, color: "#666", lineHeight: 20 },
});
