import mongoose from 'mongoose';

// URI do MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://greenleaf:greenleafaxis@greenleaf-aws.r3dgfgb.mongodb.net/?retryWrites=true&w=majority&appName=greenleaf-aws';

async function getUserDetails() {
  try {
    console.log('🔌 Conectando ao MongoDB Atlas...');
    
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Conectado!');
    
    // Buscar o usuário
    const user = await mongoose.connection.db.collection('users').findOne({});
    
    if (user) {
      console.log('👤 Usuário encontrado:');
      console.log(`  📧 Email: ${user.email}`);
      console.log(`  👤 Nome: ${user.name}`);
      console.log(`  🎭 Role: ${user.role}`);
      console.log(`  📅 Criado em: ${user.createdAt || user.created_at || 'N/A'}`);
      console.log(`  🆔 ID: ${user._id}`);
      
      // Se houver bio e avatar
      if (user.bio) console.log(`  📝 Bio: ${user.bio}`);
      if (user.avatar) console.log(`  🖼️ Avatar: ${user.avatar}`);
    } else {
      console.log('❌ Nenhum usuário encontrado');
    }
    
    await mongoose.connection.close();
    console.log('📱 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

getUserDetails();
