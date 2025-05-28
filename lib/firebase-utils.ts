import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
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
      updatedAt: serverTimestamp()
    })
  } catch (error: any) {
    throw new Error(error.message || "Erro ao atualizar perfil")
  }
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const userProfile = await getUserProfile(userCredential.user.uid)
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
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: userCredential.user.uid,
      name,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      role: "user",
      isAdmin: false,
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
