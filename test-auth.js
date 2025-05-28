// Script de teste para verificar se o Firebase Auth está funcionando
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './lib/firebase.ts';

async function testFirebaseAuth() {
  console.log('🔥 Testando Firebase Auth...');
  
  const testEmail = 'teste@greenleaf.com';
  const testPassword = '123456';
  
  try {
    // Tentar criar um usuário de teste
    console.log('📧 Criando usuário de teste...');
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Usuário criado com sucesso:', userCredential.user.email);
    
    // Tentar fazer login
    console.log('🔐 Testando login...');
    const loginCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ Login bem-sucedido:', loginCredential.user.email);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      console.log('📝 Usuário já existe, tentando fazer login...');
      try {
        const loginCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Login bem-sucedido:', loginCredential.user.email);
      } catch (loginError) {
        console.error('❌ Erro no login:', loginError.message);
      }
    }
  }
}

testFirebaseAuth();
