// Migration utility for moving data between MongoDB and Firebase
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore'
import { connectToDatabase } from './mongodb'
import { initializeApp } from 'firebase/app'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export async function migrateUsersFromMongoToFirebase() {
  console.log('🚀 Iniciando migração de usuários MongoDB → Firebase...')
  
  try {
    // Connect to MongoDB
    const { database } = await connectToDatabase()
    const users = await database.collection('users').find({}).toArray()
    
    console.log(`📊 Encontrados ${users.length} usuários no MongoDB`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const user of users) {
      try {
        console.log(`📝 Migrando usuário: ${user.email}`)
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.temporaryPassword || 'TempPass123!' // Temporary password
        )
        
        // Update display name
        if (user.name) {
          await updateProfile(userCredential.user, {
            displayName: user.name
          })
        }
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: user.email,
          name: user.name || '',
          role: user.role || 'user',
          createdAt: user.createdAt || new Date(),
          updatedAt: new Date(),
          // Preserve other fields
          ...user,
          // Remove MongoDB specific fields
          _id: undefined,
          password: undefined,
          temporaryPassword: undefined
        })
        
        console.log(`✅ Usuário ${user.email} migrado com sucesso`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Erro ao migrar ${user.email}:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n📈 Migração concluída:`)
    console.log(`✅ Sucessos: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    
    return { success: successCount, errors: errorCount }
    
  } catch (error) {
    console.log('❌ Erro durante migração:', error.message)
    throw error
  }
}

export async function migrateDataFromMongoToFirebase(collectionName) {
  console.log(`🚀 Iniciando migração de dados: ${collectionName}`)
  
  try {
    const { database } = await connectToDatabase()
    const documents = await database.collection(collectionName).find({}).toArray()
    
    console.log(`📊 Encontrados ${documents.length} documentos`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const doc of documents) {
      try {
        // Remove MongoDB _id and create Firestore document
        const { _id, ...docData } = doc
        
        // Create document in Firestore
        await setDoc(doc(db, collectionName, _id.toString()), {
          ...docData,
          migratedAt: new Date()
        })
        
        successCount++
        
      } catch (error) {
        console.log(`❌ Erro ao migrar documento:`, error.message)
        errorCount++
      }
    }
    
    console.log(`\n📈 Migração de ${collectionName} concluída:`)
    console.log(`✅ Sucessos: ${successCount}`)
    console.log(`❌ Erros: ${errorCount}`)
    
    return { success: successCount, errors: errorCount }
    
  } catch (error) {
    console.log(`❌ Erro durante migração de ${collectionName}:`, error.message)
    throw error
  }
}

export async function backupFirebaseToMongo() {
  console.log('🚀 Iniciando backup Firebase → MongoDB...')
  
  try {
    const { database } = await connectToDatabase()
    
    // Backup users
    const usersSnapshot = await getDocs(collection(db, 'users'))
    const users = []
    
    usersSnapshot.forEach(doc => {
      users.push({
        firebaseId: doc.id,
        ...doc.data(),
        backedUpAt: new Date()
      })
    })
    
    if (users.length > 0) {
      await database.collection('firebase_users_backup').insertMany(users)
      console.log(`✅ ${users.length} usuários copiados para backup`)
    }
    
    // Add other collections as needed
    console.log('📁 Backup concluído')
    
    return { users: users.length }
    
  } catch (error) {
    console.log('❌ Erro durante backup:', error.message)
    throw error
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2]
  
  switch (command) {
    case 'migrate-users':
      migrateUsersFromMongoToFirebase()
        .then(result => {
          console.log('✅ Migração de usuários concluída:', result)
          process.exit(0)
        })
        .catch(error => {
          console.log('❌ Erro na migração:', error)
          process.exit(1)
        })
      break
      
    case 'migrate-data':
      const collection = process.argv[3]
      if (!collection) {
        console.log('❌ Especifique a coleção: node migration.js migrate-data <collection>')
        process.exit(1)
      }
      migrateDataFromMongoToFirebase(collection)
        .then(result => {
          console.log(`✅ Migração de ${collection} concluída:`, result)
          process.exit(0)
        })
        .catch(error => {
          console.log('❌ Erro na migração:', error)
          process.exit(1)
        })
      break
      
    case 'backup':
      backupFirebaseToMongo()
        .then(result => {
          console.log('✅ Backup concluído:', result)
          process.exit(0)
        })
        .catch(error => {
          console.log('❌ Erro no backup:', error)
          process.exit(1)
        })
      break
      
    default:
      console.log(`
🔄 Utilitário de Migração Firebase/MongoDB

Comandos disponíveis:
  migrate-users          Migra usuários do MongoDB para Firebase
  migrate-data <coleção> Migra dados de uma coleção específica
  backup                 Faz backup do Firebase para MongoDB

Exemplos:
  node migration.js migrate-users
  node migration.js migrate-data heatmaps
  node migration.js backup
      `)
  }
}
