// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"

// Your web app's Firebase configuration - Using the correct project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRi7_kFUUzYOvmNT7gm5S8aOUdaIqEvJE",
  authDomain: "green-leaf-app-a9d22.firebaseapp.com",
  projectId: "green-leaf-app-a9d22",
  storageBucket: "green-leaf-app-a9d22.firebasestorage.app",
  messagingSenderId: "590574633655",
  appId: "1:590574633655:web:b4fb11c9c9ad41e12ade42"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics only on client side
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app
