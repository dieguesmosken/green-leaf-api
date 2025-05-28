#!/usr/bin/env node

// Script para testar comandos Firebase básicos
console.log('🔥 Testando Firebase CLI...\n')

const { exec } = require('child_process')

const commands = [
  {
    name: 'Verificar login',
    command: 'npx firebase auth:list'
  },
  {
    name: 'Listar projetos',
    command: 'npx firebase projects:list'
  },
  {
    name: 'Status do projeto atual',
    command: 'npx firebase use'
  }
]

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout)
      }
    })
  })
}

async function testFirebaseCLI() {
  for (const { name, command } of commands) {
    try {
      console.log(`📋 ${name}...`)
      const result = await runCommand(command)
      console.log(`✅ ${name} - Sucesso`)
      console.log(result)
    } catch (error) {
      console.log(`❌ ${name} - Erro:`, error.message)
    }
    console.log('---')
  }
}

testFirebaseCLI().catch(console.error)
