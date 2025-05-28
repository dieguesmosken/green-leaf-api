#!/usr/bin/env node

// Script para verificar e inicializar o Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore'
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

async function initializeFirestoreDatabase() {
  console.log('🏗️ Verificando e inicializando banco Firestore...\n')
  
  try {
    console.log('📋 Projeto Firebase:', firebaseConfig.projectId)
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('✅ Cliente Firestore inicializado')
    
    // Tentar desabilitar e reabilitar a rede para forçar conexão
    console.log('\n🔄 Testando conectividade...')
    
    try {
      await disableNetwork(db)
      console.log('✅ Rede desabilitada')
      
      await enableNetwork(db)
      console.log('✅ Rede reabilitada')
      
    } catch (networkError) {
      console.log('⚠️ Erro no teste de rede:', networkError.message)
    }
    
    console.log('\n💡 Dicas para resolver o erro NOT_FOUND:')
    console.log('1. Acesse o Console do Firebase: https://console.firebase.google.com')
    console.log(`2. Selecione o projeto: ${firebaseConfig.projectId}`)
    console.log('3. Vá em "Firestore Database"')
    console.log('4. Se não existir, clique em "Criar banco de dados"')
    console.log('5. Escolha a localização (recomendado: southamerica-east1 para Brasil)')
    console.log('6. Configure as regras de segurança iniciais')
    
    console.log('\n🔗 Link direto para o projeto:')
    console.log(`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`)
    
  } catch (error) {
    console.log('💥 Erro:', error.message)
  }
}

initializeFirestoreDatabase()
