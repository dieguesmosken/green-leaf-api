// Test script para verificar o upload de avatar
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

// Configuração do Firebase (usar as mesmas variáveis do .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testAvatarUpload() {
  try {
    console.log('🔥 Iniciando teste de upload de avatar...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    
    console.log('✅ Firebase inicializado');
    
    // Fazer login com credenciais de teste
    console.log('🔐 Fazendo login...');
    const email = 'teste@exemplo.com'; // Substitua por um email válido
    const password = 'senha123'; // Substitua por uma senha válida
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Login realizado:', user.email);
    console.log('🆔 UID do usuário:', user.uid);
    
    // Criar um arquivo de teste (simular upload)
    const testData = Buffer.from('test image data');
    const testFile = new Blob([testData], { type: 'image/png' });
    
    // Tentar fazer upload
    console.log('📤 Tentando fazer upload...');
    const storageRef = ref(storage, `avatars/${user.uid}/test-avatar.png`);
    
    const snapshot = await uploadBytes(storageRef, testFile);
    console.log('✅ Upload realizado com sucesso!');
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL de download:', downloadURL);
    
    console.log('🎉 Teste de upload de avatar concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Código do erro:', error.code);
    
    if (error.code === 'storage/unauthenticated') {
      console.log('🔍 Problema de autenticação detectado!');
      console.log('Verificando auth.currentUser:', auth.currentUser ? 'Existe' : 'Null');
    }
  }
}

// Executar o teste
testAvatarUpload();
