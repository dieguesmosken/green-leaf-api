import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User as FirebaseUser
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore"
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage"
import { auth, db, storage } from "./firebase"

export interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  createdAt?: any
  updatedAt?: any
  role?: string
  isAdmin?: boolean
  emailVerified?: boolean
  twoFactorEnabled?: boolean
  lastLoginAt?: any
  addresses?: Array<{
    id: string
    label: string
    name: string
    address: string
    city: string
    state: string
    postalCode: string
  }>
}

// Firestore functions
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return { id: uid, ...userDoc.data() } as UserProfile
    }
    
    // Se o documento não existe, mas temos um usuário autenticado, criar o perfil
    const currentUser = auth.currentUser
    if (currentUser && currentUser.uid === uid) {
      console.log("Criando perfil do usuário no Firestore...")
      const newProfile: UserProfile = {
        id: uid,
        name: currentUser.displayName || "Usuário",
        email: currentUser.email || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        isAdmin: false,
        emailVerified: currentUser.emailVerified,
        twoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        addresses: []
      }
      
      await setDoc(doc(db, "users", uid), newProfile)
      return newProfile
    }
    
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: new Date().toISOString()
    })
  } catch (error: any) {
    throw new Error(error.message || "Erro ao atualizar perfil")
  }
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Buscar ou criar perfil do usuário
    let userProfile = await getUserProfile(userCredential.user.uid)
    
    // Se ainda não existir perfil (caso raro), criar um
    if (!userProfile) {
      userProfile = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || "Usuário",
        email: userCredential.user.email || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: "user",
        isAdmin: false,
        emailVerified: userCredential.user.emailVerified,
        twoFactorEnabled: false,
        lastLoginAt: new Date().toISOString(),
        addresses: []
      }
      await setDoc(doc(db, "users", userCredential.user.uid), userProfile)
    } else {
      // Atualizar último login
      await updateUserProfile(userCredential.user.uid, { 
        lastLoginAt: new Date().toISOString(),
        emailVerified: userCredential.user.emailVerified
      })
    }
    
    return { user: userCredential.user, profile: userProfile }
  } catch (error: any) {
    throw new Error(error.message || "Erro ao fazer login")
  }
}

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Update user display name
    await updateProfile(userCredential.user, { displayName: name })
    
    // Send email verification
    await sendEmailVerification(userCredential.user)
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      name,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: "user",
      isAdmin: false,
      emailVerified: false,
      twoFactorEnabled: false,
      lastLoginAt: new Date().toISOString(),
      addresses: []
    }
    
    await setDoc(doc(db, "users", userCredential.user.uid), userProfile)
    
    return { user: userCredential.user, profile: userProfile }
  } catch (error: any) {
    throw new Error(error.message || "Erro ao criar conta")
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
  } catch (error: any) {
    throw new Error(error.message || "Erro ao fazer logout")
  }
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    throw new Error(error.message || "Erro ao enviar email de recuperação")
  }
}

// Email verification functions
export const sendVerificationEmail = async () => {
  const user = auth.currentUser
  if (!user) throw new Error("Usuário não autenticado")
  
  try {
    await sendEmailVerification(user)
  } catch (error: any) {
    throw new Error(error.message || "Erro ao enviar email de verificação")
  }
}

export const checkEmailVerification = async (): Promise<boolean> => {
  const user = auth.currentUser
  if (!user) return false
  
  // Refresh user to get latest emailVerified status
  await user.reload()
  return user.emailVerified
}

// Password update functions
export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error("Usuário não autenticado")
  
  try {
    // Re-authenticate user before changing password
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    
    // Update password
    await updatePassword(user, newPassword)
      // Update user profile in Firestore
    await updateUserProfile(user.uid, { 
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    })
  } catch (error: any) {
    throw new Error(error.message || "Erro ao atualizar senha")
  }
}

// Account management functions
export const deleteUserAccount = async (password: string) => {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error("Usuário não autenticado")
  
  try {
    // Re-authenticate user before deleting account
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
    
    // Delete user profile from Firestore
    await deleteDoc(doc(db, "users", user.uid))
    
    // Delete user account
    await user.delete()
  } catch (error: any) {
    throw new Error(error.message || "Erro ao deletar conta")
  }
}

// Storage functions with enhanced authentication
export const uploadUserAvatar = async (uid: string, file: File): Promise<string> => {
  try {
    console.log("🔍 Iniciando uploadUserAvatar...")
    debugAuthState()
    
    // Verificação inicial do usuário atual
    let currentUser = auth.currentUser
    console.log("👤 Current user inicial:", currentUser ? currentUser.email : "null")
    
    // Se não há usuário, aguardar carregamento
    if (!currentUser) {
      console.log("⏳ Aguardando autenticação...")
      currentUser = await waitForAuth()
    }
    
    // Ainda não há usuário autenticado
    if (!currentUser) {
      throw new Error("Usuário não autenticado. Por favor, faça login novamente.")
    }
    
    // Verificar se o uid coincide com o usuário atual por segurança
    if (currentUser.uid !== uid) {
      throw new Error("Usuário não autorizado para esta operação.")
    }
    
    // Forçar refresh do token para garantir validade
    console.log("🔄 Refreshing auth token...")
    try {
      await currentUser.reload()
      const token = await currentUser.getIdToken(true) // force refresh
      console.log("🔑 Token refreshed:", token ? "Presente" : "Ausente")
      
      // Aguardar um momento para garantir que o token seja propagado
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (tokenError) {
      console.error("❌ Erro ao refresh do token:", tokenError)
      throw new Error("Erro ao validar autenticação. Tente fazer login novamente.")
    }
    
    console.log("📤 Fazendo upload do avatar para usuário:", uid)
    console.log("📁 Arquivo:", file.name, "Tamanho:", file.size)
    
    // Criar referência do storage
    const timestamp = Date.now()
    const fileName = `avatar_${timestamp}_${file.name}`
    const storageRef = ref(storage, `avatars/${uid}/${fileName}`)
    
    console.log("📍 Storage path:", `avatars/${uid}/${fileName}`)
    
    // Tentar upload com retry em caso de falha de autenticação
    let uploadAttempts = 0
    const maxAttempts = 3
    
    while (uploadAttempts < maxAttempts) {
      try {
        uploadAttempts++
        console.log(`📤 Tentativa de upload ${uploadAttempts}/${maxAttempts}`)
        
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        
        console.log("✅ Upload concluído com sucesso!")
        console.log("🔗 URL:", downloadURL)
        return downloadURL
        
      } catch (uploadError: any) {
        console.error(`❌ Erro na tentativa ${uploadAttempts}:`, uploadError.code, uploadError.message)
        
        if (uploadError.code === 'storage/unauthenticated' && uploadAttempts < maxAttempts) {
          console.log("🔄 Tentando refresh de autenticação...")
          
          // Aguardar um pouco antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Tentar refresh do token novamente
          try {
            await currentUser.reload()
            await currentUser.getIdToken(true)
            console.log("🔑 Token refreshed para retry")
          } catch (refreshError) {
            console.error("❌ Falha no refresh para retry:", refreshError)
          }
          
          continue // Tentar novamente
        }
        
        // Se não é erro de autenticação ou esgotaram tentativas, lançar erro
        throw uploadError
      }
    }
    
    throw new Error("Falha no upload após múltiplas tentativas")
    
  } catch (error: any) {
    console.error("❌ Erro fatal no upload do avatar:", error)
    console.error("   Código do erro:", error.code)
    console.error("   Mensagem:", error.message)
    throw new Error(error.message || "Erro ao fazer upload da imagem")
  }
}

export const deleteUserAvatar = async (uid: string, fileName: string) => {
  try {
    const storageRef = ref(storage, `avatars/${uid}/${fileName}`)
    await deleteObject(storageRef)
  } catch (error: any) {
    throw new Error(error.message || "Erro ao deletar imagem")
  }
}

export const uploadAnalysisImage = async (uid: string, file: File): Promise<string> => {
  try {
    const timestamp = Date.now()
    const storageRef = ref(storage, `analyses/${uid}/${timestamp}_${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error: any) {
    throw new Error(error.message || "Erro ao fazer upload da análise")
  }
}

// Function to ensure auth and storage are synchronized
export const ensureAuthStorageSync = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10
    let attempts = 0
    
    const checkAuth = () => {
      attempts++
      const user = auth.currentUser
      
      console.log(`🔄 Verificação de sync ${attempts}/${maxAttempts}:`, user ? user.email : "null")
      
      if (user) {
        // Usuário encontrado, verificar se token é válido
        user.getIdToken()
          .then(() => {
            console.log("✅ Auth e Storage sincronizados")
            resolve()
          })
          .catch((error) => {
            console.error("❌ Erro ao obter token:", error)
            if (attempts < maxAttempts) {
              setTimeout(checkAuth, 500)
            } else {
              reject(new Error("Falha na sincronização Auth/Storage"))
            }
          })
      } else if (attempts < maxAttempts) {
        // Tentar novamente
        setTimeout(checkAuth, 500)
      } else {
        reject(new Error("Usuário não encontrado após múltiplas tentativas"))
      }
    }
// Helper to debug auth state
export const debugAuthState = (): void => {
  const user = auth.currentUser
  console.log("🔍 Debug Auth State:")
  console.log("  - currentUser:", user ? user.email : "null")
  console.log("  - uid:", user ? user.uid : "null")
  console.log("  - emailVerified:", user ? user.emailVerified : "null")
  console.log("  - isAnonymous:", user ? user.isAnonymous : "null")
}

// Helper to debug Firebase configuration
export const debugFirebaseConfig = (): void => {
  console.log("🔧 Firebase Config Debug:")
  console.log("  - Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
  console.log("  - Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  console.log("  - Storage Bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  console.log("  - App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
  console.log("  - Auth instance:", auth ? "Initialized" : "Not initialized")
  console.log("  - Storage instance:", storage ? "Initialized" : "Not initialized")
}
