import { auth, db, storage } from './firebase'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

export async function testFirebaseConnection() {
  console.log('🔥 Testando conexão com Firebase...')
  
  try {
    // Test Auth
    console.log('📧 Testando Firebase Auth:', auth.app.name)
    
    // Test Firestore
    console.log('🗃️ Testando Firestore:', db.app.name)
    
    // Test Storage
    console.log('📁 Testando Firebase Storage:', storage.app.name)
    
    console.log('✅ Firebase conectado com sucesso!')
    
    return {
      auth: !!auth,
      firestore: !!db,
      storage: !!storage,
      connected: true
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com Firebase:', error)
    return {
      auth: false,
      firestore: false,
      storage: false,
      connected: false,
      error: error
    }
  }
}

// Função para usar emuladores locais em desenvolvimento
export function connectToEmulators() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      // Conectar aos emuladores apenas uma vez
      if (!auth._delegate._config.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099')
      }
      
      if (!(db as any)._delegate._settings?.host?.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080)
      }
      
      if (!(storage as any)._delegate._host?.includes('localhost')) {
        connectStorageEmulator(storage, 'localhost', 9199)
      }
      
      console.log('🔧 Conectado aos emuladores Firebase')
    } catch (error) {
      console.warn('⚠️ Não foi possível conectar aos emuladores:', error)
    }
  }
}
