"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import axios from "axios"

export default function HomeScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const apiUrl = process.env.EXPO_PUBLIC_API_URL

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.post(`${apiUrl}/users/login`, {
        email,
        password,
      })
      navigation.navigate("Dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              {/* Logo Section */}
              <View style={styles.logoSection}>
                <View style={styles.logo}>
                  <Text style={styles.logoText}>♥</Text>
                </View>
                <Text style={styles.appName}>LifeShare</Text>
                <Text style={styles.subtitle}>Connecting communities through care</Text>
              </View>

              {/* Login Form */}
              <View style={styles.formContainer}>
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text)
                    error && setError("")
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9ca3af"
                />

                <TextInput
                  style={[styles.input, error && styles.inputError]}
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text)
                    error && setError("")
                  }}
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                />

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>{loading ? "Signing in..." : "Sign In"}</Text>
                </TouchableOpacity>

                {/* Signup Link */}
                <View style={styles.signupSection}>
                  <Text style={styles.signupPromptText}>Don't have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.signupLink}>Sign up here</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>By continuing, you agree to our Terms and Privacy Policy</Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "#dc2626",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "600",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
    marginBottom: 40,
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
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signupPromptText: {
    color: "#6b7280",
    fontSize: 14,
  },
  signupLink: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
})
