import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Para desenvolvimento local, você pode usar uma service account key
    // Para produção, use variáveis de ambiente
    
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      const serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }

      initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    } else {
      // Para desenvolvimento, usar emulador ou configuração padrão
      console.log('⚠️ Firebase Admin usando configuração padrão (development)')
      
      // Tentar inicializar sem credenciais para desenvolvimento
      try {
        initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        })      } catch (error: any) {
        console.log('⚠️ Não foi possível inicializar Firebase Admin:', error.message)
      }
    }
  }
}

// Initialize Firebase Admin and get instances
initializeFirebaseAdmin()

export const adminAuth = getAuth()
export const adminDb = getFirestore()
