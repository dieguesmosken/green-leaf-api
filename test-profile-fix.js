import { auth, db } from './lib/firebase.js'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const testEmail = 'teste@greenleaf.com'
const testPassword = 'teste123'
const testName = 'Usuário de Teste'

async function testAuthAndProfile() {
  console.log('🧪 Testando autenticação e criação de perfil...')
  
  try {
    // Primeiro, tentar fazer login
    console.log('🔐 Tentando fazer login...')
    let userCredential
    
    try {
      userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword)
      console.log('✅ Login bem-sucedido!')
    } catch (loginError) {
      if (loginError.code === 'auth/user-not-found') {
        console.log('👤 Usuário não encontrado, criando conta...')
        userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
        console.log('✅ Conta criada com sucesso!')
      } else {
        throw loginError
      }
    }
    
    const user = userCredential.user
    console.log('📧 Usuário autenticado:', user.email)
    console.log('🆔 UID:', user.uid)
    
    // Verificar se existe perfil no Firestore
    console.log('📄 Verificando perfil no Firestore...')
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (userDoc.exists()) {
      console.log('✅ Perfil encontrado no Firestore:')
      console.log(userDoc.data())
    } else {
      console.log('❌ Perfil não encontrado, criando...')
      
      const userProfile = {
        id: user.uid,
        name: testName,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user',
        isAdmin: false,
        emailVerified: user.emailVerified,
        twoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        addresses: []
      }
      
      await setDoc(doc(db, 'users', user.uid), userProfile)
      console.log('✅ Perfil criado no Firestore!')
      console.log(userProfile)
    }
    
    console.log('\n🎉 Teste concluído com sucesso!')
    console.log('🌐 Agora acesse: http://localhost:3000/perfil')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    console.error('Código do erro:', error.code)
  }
}

testAuthAndProfile()
