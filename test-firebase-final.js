// Teste final do sistema Firebase Auth integrado
const { exec } = require('child_process');
const path = require('path');

console.log('🧪 TESTE FINAL - FIREBASE AUTH INTEGRATION');
console.log('==========================================\n');

// Teste 1: Verificar arquivos de configuração
console.log('📁 1. Verificando arquivos de configuração...');
const requiredFiles = [
  '.firebaserc',
  'firebase.json', 
  'context/firebase-auth-context.tsx',
  'components/auth/protected-route.tsx',
  'components/auth/auth-guard.tsx',
  'lib/firebase.ts',
  'lib/firebase-utils.ts'
];

const fs = require('fs');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NÃO ENCONTRADO`);
    allFilesExist = false;
  }
});

console.log('');

// Teste 2: Verificar variáveis de ambiente
console.log('🔧 2. Verificando variáveis de ambiente...');
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_USE_FIREBASE_AUTH',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allEnvVarsExist = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar}=${process.env[envVar].substring(0, 20)}...`);
  } else {
    console.log(`   ❌ ${envVar} - NÃO DEFINIDA`);
    allEnvVarsExist = false;
  }
});

console.log('');

// Teste 3: Verificar dependências
console.log('📦 3. Verificando dependências Firebase...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const firebaseDeps = [
    'firebase',
    'sonner'
  ];
  
  firebaseDeps.forEach(dep => {
    if (deps[dep]) {
      console.log(`   ✅ ${dep}@${deps[dep]}`);
    } else {
      console.log(`   ❌ ${dep} - NÃO INSTALADA`);
    }
  });
} catch (error) {
  console.log('   ❌ Erro ao ler package.json');
}

console.log('');

// Teste 4: Verificar configuração Firebase
console.log('🔥 4. Verificando configuração Firebase...');
try {
  const { initializeApp } = require('firebase/app');
  const { getAuth } = require('firebase/auth');
  
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  console.log('   ✅ Firebase App inicializado');
  console.log('   ✅ Firebase Auth inicializado');
  console.log(`   ✅ Projeto: ${firebaseConfig.projectId}`);
  
} catch (error) {
  console.log(`   ❌ Erro na configuração Firebase: ${error.message}`);
}

console.log('');

// Resumo final
console.log('📊 RESUMO DO TESTE');
console.log('==================');

if (allFilesExist && allEnvVarsExist) {
  console.log('🎉 SUCESSO! Sistema Firebase Auth está pronto para uso');
  console.log('');
  console.log('🚀 Próximos passos:');
  console.log('   1. Acessar: http://localhost:3001');
  console.log('   2. Ir para: http://localhost:3001/login');
  console.log('   3. Criar conta ou fazer login');
  console.log('   4. Verificar redirecionamento para dashboard');
  console.log('   5. Testar upload de imagens');
  console.log('');
  console.log('⚙️  Console Firebase: https://console.firebase.google.com/project/greenleafaxis');
} else {
  console.log('⚠️  ATENÇÃO! Alguns componentes estão faltando');
  console.log('   Revise os itens marcados com ❌ acima');
}

console.log('');
console.log('✅ Teste concluído!');
