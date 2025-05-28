/**
 * Sistema robusto de upload de avatar que resolve problemas de autenticação
 * Implementa múltiplas estratégias para garantir que o upload funcione
 */

import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage, auth } from "@/lib/firebase"

interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  percentage: number
}

interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void
  maxRetries?: number
  retryDelay?: number
}

/**
 * Sistema de upload de avatar com fallback automático
 */
export class AvatarUploadService {
  private static instance: AvatarUploadService
  
  static getInstance(): AvatarUploadService {
    if (!AvatarUploadService.instance) {
      AvatarUploadService.instance = new AvatarUploadService()
    }
    return AvatarUploadService.instance
  }

  /**
   * Aguarda até que o usuário esteja totalmente autenticado
   */
  private async waitForAuthentication(uid: string): Promise<boolean> {
    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {
      attempts++
      console.log(`🔐 Verificação de autenticação ${attempts}/${maxAttempts}`)

      const currentUser = auth.currentUser
      if (currentUser && currentUser.uid === uid) {
        try {
          // Tentar obter token para verificar se auth está válida
          await currentUser.getIdToken()
          console.log("✅ Autenticação confirmada")
          return true
        } catch (tokenError) {
          console.log("❌ Erro no token, tentando refresh...")
          try {
            await currentUser.reload()
            await currentUser.getIdToken(true)
            console.log("✅ Token refreshed com sucesso")
            return true
          } catch (refreshError) {
            console.log("❌ Falha no refresh do token")
          }
        }
      }

      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return false
  }

  /**
   * Upload usando uploadBytes (estratégia 1)
   */
  private async uploadWithUploadBytes(uid: string, file: File): Promise<string> {
    console.log("📤 Estratégia 1: uploadBytes")
    
    const timestamp = Date.now()
    const fileName = `avatar_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const storageRef = ref(storage, `avatars/${uid}/${fileName}`)

    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  }

  /**
   * Upload usando uploadBytesResumable (estratégia 2)
   */
  private async uploadWithResumable(uid: string, file: File, options?: UploadOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log("📤 Estratégia 2: uploadBytesResumable")
      
      const timestamp = Date.now()
      const fileName = `avatar_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const storageRef = ref(storage, `avatars/${uid}/${fileName}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          }
          
          console.log(`📊 Progress: ${progress.percentage.toFixed(1)}%`)
          options?.onProgress?.(progress)
        },
        (error) => {
          console.error("❌ Upload resumable error:", error)
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            console.log("✅ Upload resumable completed")
            resolve(downloadURL)
          } catch (urlError) {
            console.error("❌ Error getting download URL:", urlError)
            reject(urlError)
          }
        }
      )
    })
  }

  /**
   * Upload principal com fallback automático
   */
  async uploadAvatar(uid: string, file: File, options: UploadOptions = {}): Promise<string> {
    const { maxRetries = 3, retryDelay = 1000 } = options

    console.log("🚀 Iniciando upload de avatar...")
    console.log("👤 UID:", uid)
    console.log("📁 Arquivo:", file.name, "Tamanho:", file.size)

    // Verificar se arquivo é válido
    if (!file || file.size === 0) {
      throw new Error("Arquivo inválido")
    }

    // Verificar se é imagem
    if (!file.type.startsWith('image/')) {
      throw new Error("Arquivo deve ser uma imagem")
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Imagem deve ter no máximo 5MB")
    }

    // Aguardar autenticação
    const isAuthenticated = await this.waitForAuthentication(uid)
    if (!isAuthenticated) {
      throw new Error("Falha na autenticação. Faça logout e login novamente.")
    }

    // Tentar upload com múltiplas estratégias
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Tentativa ${attempt}/${maxRetries}`)

      try {
        // Tentar estratégia 1: uploadBytes
        if (attempt <= 2) {
          try {
            return await this.uploadWithUploadBytes(uid, file)
          } catch (error: any) {
            console.log("❌ Estratégia 1 falhou:", error.message)
            lastError = error
            
            if (error.code !== 'storage/unauthenticated' || attempt === maxRetries) {
              throw error
            }
          }
        }

        // Tentar estratégia 2: uploadBytesResumable
        try {
          return await this.uploadWithResumable(uid, file, options)
        } catch (error: any) {
          console.log("❌ Estratégia 2 falhou:", error.message)
          lastError = error
          
          if (error.code !== 'storage/unauthenticated' || attempt === maxRetries) {
            throw error
          }
        }

        // Se chegou aqui, houve erro de autenticação - tentar refresh
        if (attempt < maxRetries) {
          console.log("🔄 Tentando refresh de autenticação...")
          const user = auth.currentUser
          if (user) {
            await user.reload()
            await user.getIdToken(true)
            console.log("🔑 Token refreshed para retry")
          }
          
          // Aguardar antes da próxima tentativa
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }

      } catch (error: any) {
        lastError = error
        
        if (attempt === maxRetries) {
          break
        }
        
        // Se não é erro de autenticação, não tentar novamente
        if (error.code !== 'storage/unauthenticated') {
          throw error
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    console.error("❌ Todas as estratégias de upload falharam")
    throw lastError || new Error("Falha no upload após múltiplas tentativas")
  }

  /**
   * Função de conveniência para upload simples
   */
  static async upload(uid: string, file: File, options?: UploadOptions): Promise<string> {
    const service = AvatarUploadService.getInstance()
    return service.uploadAvatar(uid, file, options)
  }
}

// Exportar função de conveniência
export const uploadAvatarRobust = AvatarUploadService.upload
