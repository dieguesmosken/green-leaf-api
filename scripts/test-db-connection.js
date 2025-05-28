import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

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

async function testConnection() {
  try {
    console.log('🔌 Tentando conectar ao MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado com sucesso ao MongoDB!');
    
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

testConnection();
