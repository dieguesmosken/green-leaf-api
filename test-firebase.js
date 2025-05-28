#!/usr/bin/env node

// Script para testar a configuração do Firebase
import dotenv from 'dotenv'
import { testFirebaseConnection } from './lib/firebase-test.js'

// Carregar variáveis de ambiente
dotenv.config()

console.log('🚀 Iniciando teste do Firebase...\n')

testFirebaseConnection()
  .then((result) => {
    console.log('\n📊 Resultado do teste:')
    console.log('Auth:', result.auth ? '✅' : '❌')
    console.log('Firestore:', result.firestore ? '✅' : '❌') 
    console.log('Storage:', result.storage ? '✅' : '❌')
    console.log('Conectado:', result.connected ? '✅' : '❌')
    
    if (result.error) {
      console.log('\n❌ Erro:', result.error)
    }
    
    process.exit(result.connected ? 0 : 1)
  })
  .catch((error) => {
    console.error('\n💥 Falha no teste:', error)
    process.exit(1)
  })
