"use client"

import React from "react"
import { useMemo, useState } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "../auth/AuthContext"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

type AuthStackParamList = {
  Login: undefined
  Register: undefined
}

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const strongPassword = (pwd: string) => pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd)

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, error, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    confirm?: string
    form?: string
  }>({})

  const isValid = useMemo(() => {
    const errs: typeof fieldErrors = {}
    if (!emailRegex.test(email.trim())) errs.email = "Enter a valid email."
    if (!strongPassword(password)) errs.password = "Use at least 8 chars incl. letters and numbers."
    if (confirm !== password) errs.confirm = "Passwords do not match."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }, [email, password, confirm])

  const handleSubmit = async () => {
    clearError()
    if (!isValid) {
      console.log("[v0] register blocked by validation")
      return
    }
    setSubmitting(true)
    console.log("[v0] register submit:", email)
    try {
      await register(email.trim(), password)
    } catch {
      console.log("[v0] register submit error surfaced from context")
      // error is already set by context
    } finally {
      setSubmitting(false)
      console.log("[v0] register submit finished")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Join SoleMate</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(t) => {
              setEmail(t)
              if (error || fieldErrors.form) clearError()
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            style={[styles.input, fieldErrors.email ? styles.inputError : undefined]}
            placeholderTextColor="#9aa0a6"
          />
          {!!fieldErrors.email && <Text style={styles.errorText}>{fieldErrors.email}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(t) => {
              setPassword(t)
              if (error || fieldErrors.form) clearError()
            }}
            secureTextEntry
            placeholder="••••••••"
            style={[styles.input, fieldErrors.password ? styles.inputError : undefined]}
            placeholderTextColor="#9aa0a6"
          />
          {!!fieldErrors.password && <Text style={styles.errorText}>{fieldErrors.password}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            value={confirm}
            onChangeText={(t) => {
              setConfirm(t)
              if (error || fieldErrors.form) clearError()
            }}
            secureTextEntry
            placeholder="••••••••"
            style={[styles.input, fieldErrors.confirm ? styles.inputError : undefined]}
            placeholderTextColor="#9aa0a6"
          />
          {!!fieldErrors.confirm && <Text style={styles.errorText}>{fieldErrors.confirm}</Text>}
        </View>

        {!!error && <Text style={styles.errorTextCenter}>{error}</Text>}

        <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Sign Up</Text>}
        </TouchableOpacity>

        <View style={styles.altRow}>
          <Text style={styles.altText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16, justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, elevation: 2 },
  title: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 4, marginBottom: 16 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#b91c1c", fontSize: 12, marginTop: 6 },
  errorTextCenter: { color: "#b91c1c", fontSize: 13, textAlign: "center", marginBottom: 8 },
  primaryBtn: { backgroundColor: "#2563eb", borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  altRow: { flexDirection: "row", justifyContent: "center", marginTop: 12, gap: 8 },
  altText: { color: "#6b7280" },
  link: { color: "#2563eb", fontWeight: "600" },
})

export default RegisterScreen
