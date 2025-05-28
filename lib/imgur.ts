/**
 * Utilitário para upload de imagens via Imgur API
 */

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || "546c25a59c58ad7" // Fallback para Client ID público

export const uploadToImgur = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.data?.error || "Falha no upload da imagem")
    }

    const data = await response.json()
    return data.data.link
  } catch (error) {
    console.error("Erro no upload para Imgur:", error)
    throw new Error("Erro ao fazer upload da imagem")
  }
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Validar tipo de arquivo
  if (!file.type.startsWith("image/")) {
    return { 
      isValid: false, 
      error: "Por favor, selecione apenas arquivos de imagem." 
    }
  }

  // Validar tamanho (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { 
      isValid: false, 
      error: "A imagem deve ter no máximo 10MB." 
    }
  }

  // Validar extensões permitidas
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: "Formato não suportado. Use JPG, PNG, GIF ou WebP." 
    }
  }

  return { isValid: true }
}
