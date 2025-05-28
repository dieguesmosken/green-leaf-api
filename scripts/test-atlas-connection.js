import mongoose from 'mongoose';

// URI do MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://greenleaf:greenleafaxis@greenleaf-aws.r3dgfgb.mongodb.net/?retryWrites=true&w=majority&appName=greenleaf-aws';

// Definir o schema do User diretamente aqui para o teste
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'researcher', 'admin'], default: 'farmer' },
  bio: { type: String },
  avatar: { type: String },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function testAtlasConnection() {
  try {
    console.log('🔌 Tentando conectar ao MongoDB Atlas...');
    console.log('📍 URI:', ATLAS_URI.replace(/\/\/.*:.*@/, '//***:***@'));
    
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Conectado com sucesso ao MongoDB Atlas!');
    
    // Verificar quantos usuários existem
    const userCount = await User.countDocuments();
    console.log(`👥 Total de usuários no banco: ${userCount}`);
    
    // Listar alguns usuários (sem senha)
    const users = await User.find({}).select('name email role createdAt').limit(5);
    console.log('📋 Usuários encontrados:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
    await mongoose.connection.close();
    console.log('📱 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

testAtlasConnection();
