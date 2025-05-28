#!/usr/bin/env node

// Teste final com banco padrão
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, onSnapshot, doc, setDoc } from 'firebase/firestore'
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

async function testFirestoreComplete() {
  console.log('🎯 TESTE FINAL: Conectividade completa do Firestore\n')
  
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)  // Banco padrão
    
    console.log('✅ Firebase inicializado com banco padrão')
    
    // Teste 1: Leitura básica
    console.log('\n📚 Teste 1: Leitura de coleções...')
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)
    console.log(`✅ Coleção 'users': ${snapshot.docs.length} documentos`)
    
    // Teste 2: Escrita (criar documento de teste)
    console.log('\n✍️ Teste 2: Escrita de dados...')
    try {
      const testDoc = doc(db, 'test', 'connectivity-test')
      await setDoc(testDoc, {
        message: 'Teste de conectividade',
        timestamp: new Date(),
        status: 'success'
      })
      console.log('✅ Escrita bem-sucedida!')
    } catch (writeError) {
      console.log(`❌ Erro na escrita: ${writeError.code} - ${writeError.message}`)
    }
    
    // Teste 3: Listener em tempo real (principal teste para erro 400)
    console.log('\n📡 Teste 3: Listener em tempo real...')
    
    return new Promise((resolve) => {
      const unsubscribe = onSnapshot(usersRef, 
        (snapshot) => {
          console.log(`✅ Listener funcionando! ${snapshot.docs.length} documentos`)
          console.log('🎉 PROBLEMA RESOLVIDO: Firestore conectando sem erros 400!')
          unsubscribe()
          resolve(true)
        },
        (error) => {
          console.log(`❌ Erro no listener: ${error.code} - ${error.message}`)
          if (error.code === 'permission-denied') {
            console.log('💡 Dica: Verifique as regras de segurança')
          }
          resolve(false)
        }
      )
      
      // Timeout de segurança
      setTimeout(() => {
        console.log('⏰ Timeout - listener não respondeu')
        unsubscribe()
        resolve(false)
      }, 5000)
    })
    
  } catch (error) {
    console.log('💥 Erro fatal:', error.message)
    return false
  }
}

testFirestoreComplete()
  .then((success) => {
    if (success) {
      console.log('\n🏆 SUCESSO TOTAL!')
      console.log('✅ Conectividade do Firestore RESTAURADA')
      console.log('✅ Sem mais erros 400 (Bad Request)')
      console.log('✅ Listeners em tempo real funcionando')
    } else {
      console.log('\n❌ Ainda há problemas a resolver')
    }
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Erro inesperado:', error)
    process.exit(1)
  })
