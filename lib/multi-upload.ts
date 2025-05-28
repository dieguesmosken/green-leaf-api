/**
 * Sistema de upload de imagens com múltiplos provedores e fallbacks
 */

export interface UploadProvider {
  name: string
  upload: (file: File) => Promise<string>
  isAvailable: () => Promise<boolean>
}

export interface UploadResult {
  success: boolean
  url?: string
  provider?: string
  error?: string
  isTemporary?: boolean
}

// Provider Imgur
const imgurProvider: UploadProvider = {
  name: "Imgur",
  upload: async (file: File): Promise<string> => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || "546c25a59c58ad7"
    const formData = new FormData()
    formData.append("image", file)

    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${CLIENT_ID}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      
      // Detectar se é erro de capacidade
      if (response.status === 503 || errorData.data?.error?.includes("capacity")) {
        throw new Error("Imgur is temporarily over capacity. Please try again later.")
      }
      
      throw new Error(errorData.data?.error || "Upload failed")
    }

    const data = await response.json()
    return data.data.link
  },
  isAvailable: async (): Promise<boolean> => {
    try {
      const response = await fetch("https://api.imgur.com/3/credits", {
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID || "546c25a59c58ad7"}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

// Provider CloudFlare R2 (alternativo)
const cloudflareProvider: UploadProvider = {
  name: "CloudFlare",
  upload: async (file: File): Promise<string> => {
    // Simulação - em produção você implementaria com suas credenciais R2
    const formData = new FormData()
    formData.append("file", file)
    
    const response = await fetch("/api/upload/cloudflare", {
      method: "POST",
      body: formData
    })

    if (!response.ok) {
      throw new Error("CloudFlare upload failed")
    }

    const data = await response.json()
    return data.url
  },
  isAvailable: async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/upload/cloudflare/status")
      return response.ok
    } catch {
      return false
    }
  }
}

// Provider Base64 (fallback local)
const base64Provider: UploadProvider = {
  name: "Base64Local",
  upload: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Salvar no localStorage com timestamp para limpeza
          const imageData = {
            data: reader.result,
            timestamp: Date.now(),
            filename: file.name,
            size: file.size
          }
          
          const imageId = `temp_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem(`image_${imageId}`, JSON.stringify(imageData))
          
          // Retorna uma URL local que pode ser resolvida depois
          resolve(`data:${file.type};base64,${reader.result.split(',')[1]}`)
        } else {
          reject(new Error("Failed to convert to base64"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  },
  isAvailable: async (): Promise<boolean> => {
    return typeof Storage !== "undefined"
  }
}

// Sistema principal de upload com fallbacks
export class MultiProviderUploader {
  private providers: UploadProvider[] = [
    imgurProvider,
    // cloudflareProvider, // Descomentado quando implementado
    base64Provider
  ]

  private async tryProvider(provider: UploadProvider, file: File): Promise<UploadResult> {
    try {
      console.log(`🔄 Tentando upload com ${provider.name}...`)
      
      const isAvailable = await provider.isAvailable()
      if (!isAvailable) {
        throw new Error(`${provider.name} não está disponível`)
      }

      const url = await provider.upload(file)
      
      console.log(`✅ Upload bem-sucedido com ${provider.name}`)
      return {
        success: true,
        url,
        provider: provider.name,
        isTemporary: provider.name === "Base64Local"
      }
    } catch (error: any) {
      console.warn(`❌ Falha no ${provider.name}:`, error.message)
      return {
        success: false,
        error: error.message,
        provider: provider.name
      }
    }
  }

  public async upload(file: File): Promise<UploadResult> {
    console.log(`🚀 Iniciando upload de ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

    // Validar arquivo primeiro
    const validation = this.validateImageFile(file)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Tentar cada provider em sequência
    for (const provider of this.providers) {
      const result = await this.tryProvider(provider, file)
      
      if (result.success) {
        // Limpeza de cache antigo se usando fallback local
        if (provider.name === "Base64Local") {
          this.cleanupOldLocalImages()
        }
        return result
      }
    }

    // Se todos falharam
    return {
      success: false,
      error: "Todos os serviços de upload estão indisponíveis. Tente novamente mais tarde."
    }
  }

  private validateImageFile(file: File): { isValid: boolean; error?: string } {
    if (!file.type.startsWith("image/")) {
      return { 
        isValid: false, 
        error: "Por favor, selecione apenas arquivos de imagem." 
      }
    }

    if (file.size > 10 * 1024 * 1024) {
      return { 
        isValid: false, 
        error: "A imagem deve ter no máximo 10MB." 
      }
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: "Formato não suportado. Use JPG, PNG, GIF ou WebP." 
      }
    }

    return { isValid: true }
  }

  private cleanupOldLocalImages(): void {
    try {
      const keys = Object.keys(localStorage)
      const imageKeys = keys.filter(key => key.startsWith("image_temp_"))
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

      imageKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          if (data.timestamp && data.timestamp < oneDayAgo) {
            localStorage.removeItem(key)
            console.log(`🧹 Removida imagem local antiga: ${key}`)
          }
        } catch {
          // Remove chaves corrompidas
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn("Erro na limpeza de imagens locais:", error)
    }
  }

  public getProviderStatus(): Promise<{ provider: string; available: boolean }[]> {
    return Promise.all(
      this.providers.map(async provider => ({
        provider: provider.name,
        available: await provider.isAvailable()
      }))
    )
  }
}

// Instância global
export const uploader = new MultiProviderUploader()

// Função de conveniência para retrocompatibilidade
export const uploadToImgur = async (file: File): Promise<string> => {
  const result = await uploader.upload(file)
  
  if (!result.success) {
    throw new Error(result.error || "Upload failed")
  }
  
  return result.url!
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith("image/")) {
    return { 
      isValid: false, 
      error: "Por favor, selecione apenas arquivos de imagem." 
    }
  }

  if (file.size > 10 * 1024 * 1024) {
    return { 
      isValid: false, 
      error: "A imagem deve ter no máximo 10MB." 
    }
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: "Formato não suportado. Use JPG, PNG, GIF ou WebP." 
    }
  }

  return { isValid: true }
}
