import { initializeApp, getApps, getApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getAuth, inMemoryPersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAOHTViBRXaO3BRG_7EtfVDX9hlGHo3EiQ",
  authDomain: "solemate-dff15.firebaseapp.com",
  projectId: "solemate-dff15",
  storageBucket: "solemate-dff15.firebasestorage.app",
  messagingSenderId: "793379416835",
  appId: "1:793379416835:web:f070b1a3b14c19816dd736",
  measurementId: "G-PSZEKLMNPL",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

let auth
try {
  // If auth already initialized, reuse it
  auth = getAuth(app)
} catch (e) {
  console.log("[v0] initializeAuth with inMemoryPersistence (no session persistence)")
  auth = initializeAuth(app, { persistence: inMemoryPersistence })
}

export const storage = getStorage(app)
export const db = getFirestore(app)
export { auth }
