import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Using the correct project configuration
    const projectConfig = {
      projectId: "green-leaf-app-a9d22",
      storageBucket: "green-leaf-app-a9d22.firebasestorage.app",
    }

    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      const serviceAccount = {
        projectId: "green-leaf-app-a9d22",
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }

      initializeApp({
        credential: cert(serviceAccount),
        ...projectConfig
      })
    } else {
      // Para desenvolvimento, usar configuração padrão com o projeto correto
      console.log('⚠️ Firebase Admin usando configuração padrão (development)')
      
      try {
        initializeApp(projectConfig)
      } catch (error: any) {
        console.log('⚠️ Não foi possível inicializar Firebase Admin:', error.message)
      }
    }
  }
}

// Initialize Firebase Admin and get instances
initializeFirebaseAdmin()

export const adminAuth = getAuth()
export const adminDb = getFirestore()
