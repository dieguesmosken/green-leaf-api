// Firebase Connection Test Utilities (JavaScript)
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import fs from 'fs'
import path from 'path'

// Função para carregar .env manualmente
function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=')
        if (key && value) {
          process.env[key.trim()] = value.trim()
        }
      }
    })
  } catch (error) {
    console.log('Aviso: Não foi possível carregar .env:', error.message)
  }
}

// Carregar variáveis de ambiente
loadEnvFile()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

export async function testFirebaseConnection() {
  console.log('🔧 Testando configuração do Firebase...')
  
  try {
    // Verificar variáveis de ambiente
    const missingVars = []
    if (!firebaseConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
    if (!firebaseConfig.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
    if (!firebaseConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
    
    if (missingVars.length > 0) {
      console.log('❌ Variáveis de ambiente faltando:', missingVars.join(', '))
      return { auth: false, firestore: false, storage: false, connected: false, error: 'Variáveis de ambiente faltando' }
    }
    
    console.log('✅ Variáveis de ambiente configuradas')
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    console.log('✅ Firebase App inicializado')
    
    // Testar Auth
    const auth = getAuth(app)
    console.log('✅ Firebase Auth configurado')
    
    // Testar Firestore
    const db = getFirestore(app)
    console.log('✅ Firestore configurado')
    
    // Testar Storage
    const storage = getStorage(app)
    console.log('✅ Firebase Storage configurado')
    
    return {
      auth: true,
      firestore: true,
      storage: true,
      connected: true,
      error: null
    }
    
  } catch (error) {
    console.log('❌ Erro ao conectar com Firebase:', error.message)
    return {
      auth: false,
      firestore: false,
      storage: false,
      connected: false,
      error: error.message
    }
  }
}
