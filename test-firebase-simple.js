// Teste simples do Firebase
console.log('🚀 Iniciando teste simples do Firebase...')

import { initializeApp } from 'firebase/app'
import fs from 'fs'
import path from 'path'

// Carregar .env
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...value] = line.split('=')
        if (key && value.length) {
          process.env[key.trim()] = value.join('=').trim()
        }
      }
    })
  } catch (error) {
    console.log('❌ Erro carregando .env:', error.message)
  }
}

loadEnv()

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

console.log('📋 Verificando configuração:')
console.log('- Project ID:', config.projectId || '❌ não encontrado')
console.log('- API Key:', config.apiKey ? '✅ configurado' : '❌ não encontrado')

try {
  const app = initializeApp(config)
  console.log('✅ Firebase App inicializado com sucesso!')
  console.log('📦 App name:', app.name)
  console.log('🎯 Project ID:', app.options.projectId)
  
  console.log('\n🎉 Teste simples concluído com sucesso!')
} catch (error) {
  console.log('❌ Erro:', error.message)
}

process.exit(0)
