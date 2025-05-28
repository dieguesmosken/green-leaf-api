#!/usr/bin/env node

// Teste com o banco Firestore correto
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore'
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

async function testCorrectDatabase() {
  console.log('🔥 Testando conexão com banco Firestore correto...\n')
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app, "greenleafbd")  // Banco específico
    
    console.log('✅ Conectado ao banco: greenleafbd')
    
    // Teste de leitura
    console.log('\n📚 Testando leitura de coleções...')
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      console.log(`✅ Coleção 'users' - ${snapshot.docs.length} documentos`)
      
      // Listar documentos encontrados
      if (snapshot.docs.length > 0) {
        console.log('📄 Documentos encontrados:')
        snapshot.docs.forEach((doc, index) => {
          console.log(`  ${index + 1}. ID: ${doc.id}`)
        })
      }
    } catch (readError) {
      console.log('❌ Erro na leitura:', readError.message)
      console.log('   Código:', readError.code)
    }
    
    // Teste de listener em tempo real
    console.log('\n📡 Testando listener em tempo real...')
    try {
      const usersRef = collection(db, 'users')
      
      const unsubscribe = onSnapshot(usersRef, 
        (snapshot) => {
          console.log(`✅ Listener funcionando - ${snapshot.docs.length} documentos`)
          console.log('🎉 Problema de conectividade RESOLVIDO!')
          unsubscribe()
          process.exit(0)
        },
        (error) => {
          console.log('❌ Erro no listener:', error.message)
          console.log('   Código:', error.code)
          process.exit(1)
        }
      )
      
      // Aguardar resposta
      setTimeout(() => {
        console.log('⏰ Timeout - sem resposta do listener')
        process.exit(1)
      }, 5000)
      
    } catch (listenerError) {
      console.log('❌ Erro ao configurar listener:', listenerError.message)
      process.exit(1)
    }
    
  } catch (error) {
    console.log('💥 Erro fatal:', error.message)
    process.exit(1)
  }
}

testCorrectDatabase()
