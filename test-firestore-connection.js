#!/usr/bin/env node

// Teste específico para conexão do Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'
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

async function testFirestoreConnection() {
  console.log('🔥 Testando conexão do Firestore...\n')
  
  try {
    // Verificar configuração
    console.log('📋 Configuração do Firebase:')
    console.log(`  - Projeto: ${firebaseConfig.projectId}`)
    console.log(`  - Auth Domain: ${firebaseConfig.authDomain}`)
    console.log(`  - API Key: ${firebaseConfig.apiKey ? 'Configurada' : 'AUSENTE'}`)
    
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      throw new Error('Configuração Firebase incompleta!')
    }
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const auth = getAuth(app)
    
    console.log('\n✅ Firebase inicializado com sucesso')
    
    // Teste 1: Conectar anonimamente
    console.log('\n🔐 Teste 1: Autenticação anônima...')
    try {
      await signInAnonymously(auth)
      console.log('✅ Autenticação anônima bem-sucedida')
    } catch (authError) {
      console.log('❌ Erro na autenticação anônima:', authError.message)
      console.log('⚠️ Continuando sem autenticação...')
    }
    
    // Teste 2: Tentar ler uma coleção simples
    console.log('\n📚 Teste 2: Lendo coleções...')
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      console.log(`✅ Coleção 'users' acessível - ${snapshot.docs.length} documentos`)
    } catch (readError) {
      console.log('❌ Erro ao ler coleção users:', readError.message)
      console.log('   Código do erro:', readError.code)
    }
    
    // Teste 3: Listener em tempo real (onde geralmente ocorre o erro 400)
    console.log('\n📡 Teste 3: Listener em tempo real...')
    try {
      const usersRef = collection(db, 'users')
      
      const unsubscribe = onSnapshot(usersRef, 
        (snapshot) => {
          console.log(`✅ Listener ativo - ${snapshot.docs.length} documentos`)
          unsubscribe() // Desconectar após primeiro resultado
        },
        (error) => {
          console.log('❌ Erro no listener:', error.message)
          console.log('   Código do erro:', error.code)
          if (error.code === 'permission-denied') {
            console.log('   💡 Dica: Verifique as regras de segurança do Firestore')
          }
        }
      )
      
      // Aguardar 3 segundos para o listener responder
      await new Promise(resolve => setTimeout(resolve, 3000))
      
    } catch (listenerError) {
      console.log('❌ Erro ao configurar listener:', listenerError.message)
    }
    
    console.log('\n📊 Teste concluído!')
    
  } catch (error) {
    console.log('\n💥 Erro fatal:', error.message)
    return false
  }
  
  return true
}

testFirestoreConnection()
  .then((success) => {
    console.log('\n🏁 Resultado:', success ? 'SUCESSO' : 'FALHA')
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('\n💥 Erro inesperado:', error)
    process.exit(1)
  })
