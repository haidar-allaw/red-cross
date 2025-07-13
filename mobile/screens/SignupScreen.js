"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import axios from "axios"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function SignupScreen({ navigation }) {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bloodtype, setBloodtype] = useState("")
  const [address, setAddress] = useState("")

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([
    { label: "O-", value: "O-" },
    { label: "O+", value: "O+" },
    { label: "A-", value: "A-" },
    { label: "A+", value: "A+" },
    { label: "B-", value: "B-" },
    { label: "B+", value: "B+" },
    { label: "AB-", value: "AB-" },
    { label: "AB+", value: "AB+" },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  const handleSignup = async () => {
    setLoading(true)
    setError("")
    setSuccess("")
    const signupData = {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      bloodtype,
      address,
      role: "user",
    }
    try {
      await axios.post(`${apiUrl}/users/signup`, signupData)
      setSuccess("Signup successful! Redirecting...")
      navigation.replace("Dashboard")
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed"
      if (errorMessage.toLowerCase().includes("email")) {
        setError("This email is already registered. Please use a different email address.")
      } else if (errorMessage.toLowerCase().includes("phone")) {
        setError("This phone number is already registered. Please use a different phone number.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (setter) => (value) => {
    setter(value)
    if (error) setError("")
    if (success) setSuccess("")
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={20}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>♥</Text>
              </View>
              <Text style={styles.appName}>LifeShare</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>Join LifeShare and start making a difference</Text>

              {error ? <Text style={styles.error}>{error}</Text> : null}
              {success ? <Text style={styles.success}>{success}</Text> : null}

              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="First Name"
                value={firstname}
                onChangeText={handleFieldChange(setFirstname)}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Last Name"
                value={lastname}
                onChangeText={handleFieldChange(setLastname)}
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={handleFieldChange(setEmail)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Password"
                value={password}
                onChangeText={handleFieldChange(setPassword)}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={handleFieldChange(setPhoneNumber)}
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />

              <DropDownPicker
                open={open}
                value={bloodtype}
                items={items}
                setOpen={setOpen}
                setValue={setBloodtype}
                setItems={setItems}
                placeholder="Select Blood Type (optional)"
                style={[styles.input, error && styles.inputError]} // Apply base input style
                containerStyle={styles.dropdownContainer}
                listMode="MODAL"
                modalTitle="Select Blood Type"
                modalContentContainerStyle={styles.modalContent}
                modalTitleStyle={styles.modalTitle}
                dropDownContainerStyle={styles.dropDownBox}
                textStyle={styles.pickerText}
                placeholderStyle={styles.pickerPlaceholder}
                selectedItemLabelStyle={styles.selectedItem}
                itemSeparator
                itemSeparatorStyle={{ backgroundColor: "#eee" }}
              />

              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Address (optional)"
                value={address}
                onChangeText={handleFieldChange(setAddress)}
                placeholderTextColor="#9ca3af"
              />

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>{loading ? "Signing up..." : "Sign Up"}</Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginSection}>
                <Text style={styles.loginPromptText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                  <Text style={styles.loginLink}>Log in here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 32,
    backgroundColor: "#fff",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: "#dc2626",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 20,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    height: 48,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
  },
  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  success: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#ecfdf5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  dropdownContainer: {
    width: "100%",
    marginBottom: 16,
    zIndex: 1000, // Ensure dropdown is above other elements
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#111827",
    marginBottom: 8,
  },
  dropDownBox: {
    borderColor: "#e5e7eb", // Match input border color
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#f9fafb", // Match input background color
  },
  pickerText: {
    fontSize: 16,
    color: "#111827",
  },
  pickerPlaceholder: {
    color: "#9ca3af",
  },
  selectedItem: {
    fontWeight: "600",
    color: "#dc2626",
  },
  signupButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signupButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  signupButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  loginPromptText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
})
