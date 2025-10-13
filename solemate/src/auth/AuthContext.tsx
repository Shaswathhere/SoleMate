"use client"

import React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "../../firebaseConfig"

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to auth state; with inMemoryPersistence, this only lives during app runtime
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("[v0] onAuthStateChanged user:", firebaseUser ? firebaseUser.uid : null)
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const mapFirebaseError = (code?: string) => {
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address."
      case "auth/user-disabled":
        return "This account has been disabled."
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Incorrect email or password."
      case "auth/email-already-in-use":
        return "Email is already in use."
      case "auth/weak-password":
        return "Password is too weak. Use at least 8 characters with letters and numbers."
      default:
        return "Something went wrong. Please try again."
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    console.log("[v0] login start:", email)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("[v0] login success")
    } catch (e: any) {
      console.log("[v0] login error:", e?.code, e?.message)
      setError(mapFirebaseError(e?.code))
      throw e
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    setError(null)
    console.log("[v0] register start:", email)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      console.log("[v0] register success")
    } catch (e: any) {
      console.log("[v0] register error:", e?.code, e?.message)
      setError(mapFirebaseError(e?.code))
      throw e
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    console.log("[v0] logout start")
    await signOut(auth)
    console.log("[v0] logout success")
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, clearError }),
    [user, loading, error, login, register, logout, clearError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
