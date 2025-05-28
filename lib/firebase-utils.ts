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

// Storage functions
export const uploadUserAvatar = async (uid: string, file: File): Promise<string> => {
  try {
    const storageRef = ref(storage, `avatars/${uid}/${file.name}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error: any) {
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

// Helper to get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser
}

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser
}
