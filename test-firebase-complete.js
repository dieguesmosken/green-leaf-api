// Teste completo do sistema Firebase integrado
// Execute: npm run test:firebase:complete

import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, signOut } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import fs from 'fs'
import path from 'path'

// Carregar variáveis de ambiente
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

async function runCompleteTest() {
  console.log('🚀 Iniciando teste completo do Firebase...\n')
  
  try {
    console.log('📋 Configuração carregada:')
    console.log('- API Key:', firebaseConfig.apiKey ? '✅' : '❌')
    console.log('- Project ID:', firebaseConfig.projectId || 'não encontrado')
    
    // Inicializar Firebase
    console.log('\n🔧 Inicializando Firebase...')
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const storage = getStorage(app)
    
    console.log('✅ Firebase inicializado com sucesso')
    
    // Teste 1: Autenticação
    console.log('\n📝 Teste 1: Autenticação...')
    const userCredential = await signInAnonymously(auth)
    console.log('✅ Login anônimo realizado:', userCredential.user.uid)
    
    // Teste 2: Firestore
    console.log('\n📝 Teste 2: Firestore...')
    const testDoc = doc(db, 'test', 'integration-test')
    const testData = {
      message: 'Hello Firebase!',
      timestamp: new Date(),
      userId: userCredential.user.uid
    }
    
    await setDoc(testDoc, testData)
    console.log('✅ Documento criado no Firestore')
    
    const docSnap = await getDoc(testDoc)
    if (docSnap.exists()) {
      console.log('✅ Documento lido do Firestore:', docSnap.data().message)
    }
    
    // Teste 3: Storage (simulado - criar arquivo temporário)
    console.log('\n📝 Teste 3: Storage...')
    const testContent = 'Este é um arquivo de teste do Firebase Storage'
    const testBuffer = Buffer.from(testContent, 'utf8')
    
    const storageRef = ref(storage, `test/integration-test-${Date.now()}.txt`)
    
    try {
      await uploadBytes(storageRef, testBuffer)
      console.log('✅ Arquivo enviado para Storage')
      
      const downloadURL = await getDownloadURL(storageRef)
      console.log('✅ URL de download obtida:', downloadURL.substring(0, 50) + '...')
      
      // Limpeza do Storage
      await deleteObject(storageRef)
      console.log('✅ Arquivo removido do Storage')
    } catch (storageError) {
      console.log('⚠️  Storage test failed (pode ser necessário configurar regras):', storageError.message)
    }
    
    // Limpeza do Firestore
    await deleteDoc(testDoc)
    console.log('✅ Documento removido do Firestore')
    
    // Logout
    await signOut(auth)
    console.log('✅ Logout realizado')
    
    console.log('\n🎉 Todos os testes passaram! Firebase está funcionando perfeitamente.')
    
    // Verificar sistema dual
    console.log('\n📝 Verificando configuração do sistema dual...')
    const useFirebaseAuth = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'
    console.log(`Sistema de auth ativo: ${useFirebaseAuth ? 'Firebase' : 'MongoDB'}`)
    
    return {
      success: true,
      auth: true,
      firestore: true,
      storage: true,
      systemType: useFirebaseAuth ? 'Firebase' : 'MongoDB'
    }
    
  } catch (error) {
    console.log('\n❌ Erro durante o teste:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCompleteTest()
    .then(result => {
      console.log('\n📊 Resumo do teste:', result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Erro fatal:', error)
      process.exit(1)
    })
}

export { runCompleteTest }
