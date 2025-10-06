import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOHTViBRXaO3BRG_7EtfVDX9hlGHo3EiQ",
  authDomain: "solemate-dff15.firebaseapp.com",
  projectId: "solemate-dff15",
  storageBucket: "solemate-dff15.firebasestorage.app",
  messagingSenderId: "793379416835",
  appId: "1:793379416835:web:f070b1a3b14c19816dd736",
  measurementId: "G-PSZEKLMNPL"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);