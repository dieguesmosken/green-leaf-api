import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// URI do MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://greenleaf:greenleafaxis@greenleaf-aws.r3dgfgb.mongodb.net/?retryWrites=true&w=majority&appName=greenleaf-aws';

async function testLogin() {
  try {
    console.log('🔌 Conectando ao MongoDB Atlas...');
    
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Conectado!');
    
    // Buscar o usuário
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'dmosken2015@gmail.com' });
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    console.log('👤 Usuário encontrado, testando senhas...');
    
    // Testar senhas comuns
    const commonPasswords = ['123456', 'password', 'admin', '123', '1234', '12345', 'senha', 'greenleaf'];
    
    for (const password of commonPasswords) {
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`🔐 Senha "${password}": ${isMatch ? '✅ CORRETA!' : '❌ incorreta'}`);
        
        if (isMatch) {
          console.log(`🎉 LOGIN FUNCIONARÁ COM: ${password}`);
          break;
        }
      } catch (error) {
        console.log(`❌ Erro testando senha "${password}": ${error.message}`);
      }
    }
    
    await mongoose.connection.close();
    console.log('📱 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testLogin();
