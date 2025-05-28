import mongoose from 'mongoose';

// URI do MongoDB Atlas
const ATLAS_URI = 'mongodb+srv://greenleaf:greenleafaxis@greenleaf-aws.r3dgfgb.mongodb.net/?retryWrites=true&w=majority&appName=greenleaf-aws';

async function checkAllCollections() {
  try {
    console.log('🔌 Conectando ao MongoDB Atlas...');
    
    await mongoose.connect(ATLAS_URI);
    console.log('✅ Conectado!');
    
    // Listar todas as coleções no banco
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Coleções encontradas:');
    
    for (const collection of collections) {
      const name = collection.name;
      const count = await mongoose.connection.db.collection(name).countDocuments();
      console.log(`  - ${name}: ${count} documentos`);
      
      // Se for uma coleção de usuários, mostrar alguns documentos
      if (name.toLowerCase().includes('user')) {
        const docs = await mongoose.connection.db.collection(name).find({}).limit(3).toArray();
        console.log(`    Exemplos:`);
        docs.forEach(doc => {
          console.log(`      - ${doc.name || doc.email || doc._id} (${doc.role || 'sem role'})`);
        });
      }
    }
    
    await mongoose.connection.close();
    console.log('📱 Conexão fechada.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkAllCollections();
