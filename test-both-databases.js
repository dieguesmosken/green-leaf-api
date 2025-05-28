#!/usr/bin/env node

// Teste comparativo entre banco padrão e personalizado
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import dotenv from 'dotenv'

// Carrega variáveis de ambiente
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

async function testBothDatabases() {
  console.log('🔥 Testando ambos os bancos Firestore...\n')
  
  try {
    const app = initializeApp(firebaseConfig)
    
    // Teste banco padrão
    console.log('📊 Testando banco padrão (default)...')
    try {
      const dbDefault = getFirestore(app)
      const usersRefDefault = collection(dbDefault, 'users')
      const snapshotDefault = await getDocs(usersRefDefault)
      console.log(`✅ Banco padrão: ${snapshotDefault.docs.length} documentos na coleção 'users'`)
    } catch (errorDefault) {
      console.log(`❌ Banco padrão: ${errorDefault.code} - ${errorDefault.message}`)
    }
    
    // Teste banco personalizado
    console.log('\n📊 Testando banco personalizado (greenleafbd)...')
    try {
      const dbCustom = getFirestore(app, "greenleafbd")
      const usersRefCustom = collection(dbCustom, 'users')
      const snapshotCustom = await getDocs(usersRefCustom)
      console.log(`✅ Banco personalizado: ${snapshotCustom.docs.length} documentos na coleção 'users'`)
    } catch (errorCustom) {
      console.log(`❌ Banco personalizado: ${errorCustom.code} - ${errorCustom.message}`)
    }
    
    // Testar outras coleções comuns
    console.log('\n📊 Testando outras coleções no banco personalizado...')
    const dbCustom = getFirestore(app, "greenleafbd")
    
    const collections = ['analyses', 'images', 'heatmaps', 'uploads']
    for (const collectionName of collections) {
      try {
        const collRef = collection(dbCustom, collectionName)
        const snapshot = await getDocs(collRef)
        console.log(`✅ Coleção '${collectionName}': ${snapshot.docs.length} documentos`)
      } catch (error) {
        console.log(`❌ Coleção '${collectionName}': ${error.code} - ${error.message}`)
      }
    }
    
  } catch (error) {
    console.log('💥 Erro geral:', error.message)
  }
}

testBothDatabases()
