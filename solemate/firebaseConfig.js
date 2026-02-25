import { initializeApp, getApps, getApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAOHTViBRXaO3BRG_7EtfVDX9hlGHo3EiQ",
  authDomain: "solemate-dff15.firebaseapp.com",
  projectId: "solemate-dff15",
  storageBucket: "solemate-dff15.appspot.com",
  messagingSenderId: "793379416835",
  appId: "1:793379416835:web:f070b1a3b14c19816dd736",
  measurementId: "G-PSZEKLMNPL",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const storage = getStorage(app)
export const db = getFirestore(app)
export { auth }