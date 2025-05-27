import mongoose from 'mongoose';

// URI do MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://greenleaf:greenleafaxis@greenleaf-aws.r3dgfgb.mongodb.net/?retryWrites=true&w=majority&appName=greenleaf-aws';

async function checkUserPassword() {
  try {
    console.log('🔌 Conectando ao MongoDB Atlas...');
    
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Conectado!');
    
    // Buscar o usuário com a senha (apenas para verificação)
    const user = await mongoose.connection.db.collection('users').findOne({ email: 'dmosken2015@gmail.com' });
    
    if (user) {
      console.log('👤 Usuário encontrado:');
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  👤 Nome: ${user.name}`);
      console.log(`  🔐 Tem senha?: ${user.password ? 'SIM' : 'NÃO'}`);
      console.log(`  🔐 Tipo da senha: ${typeof user.password}`);
      console.log(`  🔐 Começa com $2: ${user.password && user.password.startsWith('$2') ? 'SIM (hash bcrypt)' : 'NÃO (texto plano)'}`);
      
      if (user.password) {
        console.log(`  🔐 Primeiros 20 caracteres: ${user.password.substring(0, 20)}...`);
      }
    } else {
      console.log('❌ Usuário não encontrado');
    }
    
    await mongoose.connection.close();
    console.log('📱 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkUserPassword();
