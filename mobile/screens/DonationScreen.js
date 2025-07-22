// DonationScreen.jsx

"use client";

import React, { useEffect, useState } from "react";
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
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DonationScreen({ navigation }) {
  // Form state
  const [medicalCenter, setMedicalCenter] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [units, setUnits] = useState("1");
  const [donationDate, setDonationDate] = useState(new Date());

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Data state
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  // Fetch centers
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/centers/all`);
        setCenters(data);
      } catch {
        Alert.alert("Error", "Could not load medical centers.");
      } finally {
        setLoadingCenters(false);
      }
    })();
  }, []);

  // Logout nav
  const handleLogout = () => navigation.replace("Login");

  const handleDonationSubmit = async () => {
    if (!medicalCenter || !bloodType || !units) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    // Date check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sel = new Date(donationDate);
    sel.setHours(0, 0, 0, 0);
    if (sel < today) {
      Alert.alert("Invalid Date", "Choose today or later.");
      return;
    }

    setSubmitting(true);
    try {
      // grab token
      const token = await AsyncStorage.getItem("userToken");
      const url = `${apiUrl}/blood/donate`;
      const body = {
        medicalCenter,
        bloodtype: bloodType,
        units: Number(units),
        timestamp: donationDate.toISOString(),
        note: "",
      };

      // ⚠️  Notice: body is 2nd arg, { headers } is 3rd arg
      await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert(
        "Donation Scheduled!",
        `Booked ${units} unit(s) of ${bloodType} on ${donationDate.toLocaleDateString()} at ${
          centers.find((c) => c._id === medicalCenter)?.name
        }.`
      );

      setMedicalCenter("");
      setBloodType("");
      setUnits("1");
      setDonationDate(new Date());
    } catch (err) {
      console.error(
        "❌ Submission error:",
        err.response?.status,
        err.response?.data
      );
      Alert.alert(
        "Submission Failed",
        err.response?.data?.message || "Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCenterName = medicalCenter
    ? centers.find((c) => c._id === medicalCenter)?.name || "Select a center"
    : "Select a center";

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>♥</Text>
              </View>
              <TouchableOpacity onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={28} color="#dc2626" />
              </TouchableOpacity>
            </View>
            <Text style={styles.appName}>LifeShare</Text>
            <Text style={styles.title}>Schedule Your Donation</Text>
            <Text style={styles.subtitle}>Your generosity can save lives.</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Donation Details</Text>

            <Text style={styles.label}>Medical Center</Text>
            {loadingCenters ? (
              <ActivityIndicator color="#dc2626" size="large" />
            ) : (
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowCenterModal(true)}
              >
                <Text
                  style={
                    medicalCenter ? styles.inputText : styles.placeholderText
                  }
                >
                  {selectedCenterName}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={styles.label}>Blood Type</Text>
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
                      styles.bloodTypeButtonText,
                      bloodType === type && styles.bloodTypeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Units</Text>
            <TextInput
              style={[styles.input, styles.numericInput]}
              keyboardType="numeric"
              value={units}
              onChangeText={setUnits}
            />

            <Text style={styles.label}>Preferred Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.inputText}>
                {donationDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={donationDate}
                mode="date"
                display="calendar"
                minimumDate={new Date()}
                onChange={(_, d) => {
                  setShowDatePicker(false);
                  d && setDonationDate(d);
                }}
              />
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleDonationSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Schedule Donation</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Center Modal */}
      <Modal
        visible={showCenterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCenterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Medical Center</Text>
            <FlatList
              data={centers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setMedicalCenter(item._id);
                    setShowCenterModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  <Text style={styles.modalItemAddress}>{item.address}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.modalItemSeparator} />
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCenterModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 30 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: "#dc2626",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "#fff", fontSize: 30, fontWeight: "700" },
  appName: { fontSize: 28, fontWeight: "800", color: "#111827", marginTop: 10 },
  title: { fontSize: 26, fontWeight: "700", color: "#111827", marginTop: 6 },
  subtitle: { fontSize: 15, color: "#6b7280", marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#f9fafb",
    marginBottom: 15,
    justifyContent: "center",
  },
  numericInput: { textAlign: "center" },
  inputText: { fontSize: 16, color: "#111827" },
  placeholderText: { fontSize: 16, color: "#9ca3af" },
  bloodTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  bloodTypeButton: {
    width: "23%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  bloodTypeButtonActive: { backgroundColor: "#dc2626", borderColor: "#dc2626" },
  bloodTypeButtonText: { color: "#4b5563", fontWeight: "500" },
  bloodTypeButtonTextActive: { color: "#fff", fontWeight: "700" },
  submitButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: { backgroundColor: "#9ca3af" },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
  },
  modalItem: { paddingVertical: 12 },
  modalItemText: { fontSize: 17, fontWeight: "600" },
  modalItemAddress: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  modalItemSeparator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 5,
  },
  modalCloseButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  modalCloseButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
