"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { 
  signIn, 
  signUp, 
  signOutUser, 
  getUserProfile, 
  updateUserProfile,
  sendVerificationEmail,
  checkEmailVerification,
  updateUserPassword,
  deleteUserAccount,
  UserProfile 
} from "@/lib/firebase-utils"
import { toast } from "sonner"

type AuthContextType = {
  user: UserProfile | null
  firebaseUser: FirebaseUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (data: Partial<UserProfile>) => Promise<void>
  sendEmailVerification: () => Promise<void>
  checkEmailVerification: () => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setFirebaseUser(firebaseUser)
        
        if (firebaseUser) {
          // Usuário autenticado - buscar perfil do Firestore
          const userProfile = await getUserProfile(firebaseUser.uid)
          setUser(userProfile)
        } else {
          // Usuário não autenticado
          setUser(null)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await signIn(email, password)
      
      // O estado será atualizado automaticamente pelo onAuthStateChanged
      toast.success("Login realizado com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const result = await signUp(name, email, password)
      
      // O estado será atualizado automaticamente pelo onAuthStateChanged
      toast.success("Conta criada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOutUser()
      setUser(null)
      setFirebaseUser(null)
      toast.success("Logout realizado com sucesso!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer logout")
      throw error
    }
  }
  const updateUser = async (data: Partial<UserProfile>) => {
    if (!firebaseUser) throw new Error("Usuário não autenticado")
    
    try {
      await updateUserProfile(firebaseUser.uid, data)
      
      // Atualizar estado local
      setUser(prev => prev ? { ...prev, ...data } : null)
      
      toast.success("Perfil atualizado com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil")
      throw error
    }
  }

  const sendEmailVerificationHandler = async () => {
    try {
      await sendVerificationEmail()
      toast.success("Email de verificação enviado!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar email de verificação")
      throw error
    }
  }

  const checkEmailVerificationHandler = async (): Promise<boolean> => {
    try {
      const isVerified = await checkEmailVerification()
      if (isVerified && user) {
        // Atualizar perfil local se email foi verificado
        await updateUserProfile(firebaseUser!.uid, { emailVerified: true })
        setUser(prev => prev ? { ...prev, emailVerified: true } : null)
      }
      return isVerified
    } catch (error: any) {
      console.error("Erro ao verificar email:", error)
      return false
    }
  }

  const updatePasswordHandler = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true)
      await updateUserPassword(currentPassword, newPassword)
      toast.success("Senha atualizada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar senha")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccountHandler = async (password: string) => {
    try {
      setIsLoading(true)
      await deleteAccount(password)
      setUser(null)
      setFirebaseUser(null)
      toast.success("Conta deletada com sucesso!")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar conta")
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  const value: AuthContextType = {
    user,
    firebaseUser,
    login,
    register,
    logout,
    updateUser,
    sendEmailVerification: sendEmailVerificationHandler,
    checkEmailVerification: checkEmailVerificationHandler,
    updatePassword: updatePasswordHandler,
    deleteAccount: deleteAccountHandler,
    isLoading,
    isAuthenticated: !!firebaseUser
  }

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

export function useFirebaseAuth() {
  const context = useContext(FirebaseAuthContext)
  if (context === undefined) {
    throw new Error("useFirebaseAuth deve ser usado dentro de um FirebaseAuthProvider")
  }
  return context
}

// Hook para compatibilidade com o contexto existente
export function useAuth() {
  return useFirebaseAuth()
}
