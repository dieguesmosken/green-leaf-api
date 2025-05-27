/**
 * Utilitários para processamento de imagens no navegador
 * Compressão, redimensionamento e cache
 */

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Comprime uma imagem automaticamente
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    maxSizeKB = 500
  } = options

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calcular dimensões respeitando aspect ratio
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }

      canvas.width = width
      canvas.height = height

      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height)

      // Tentar diferentes qualidades até atingir o tamanho desejado
      let currentQuality = quality
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha na compressão da imagem'))
              return
            }

            const sizeKB = blob.size / 1024

            // Se ainda está muito grande e qualidade > 0.1, tentar menor qualidade
            if (sizeKB > maxSizeKB && currentQuality > 0.1) {
              currentQuality -= 0.1
              tryCompress()
              return
            }

            // Criar novo arquivo com o blob comprimido
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })

            resolve(compressedFile)
          },
          file.type,
          currentQuality
        )
      }

      tryCompress()
    }

    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Redimensiona uma imagem para dimensões específicas
 */
export const resizeImage = async (
  file: File,
  width: number,
  height: number,
  maintainAspectRatio = true
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      let newWidth = width
      let newHeight = height

      if (maintainAspectRatio) {
        const ratio = Math.min(width / img.width, height / img.height)
        newWidth = img.width * ratio
        newHeight = img.height * ratio
      }

      canvas.width = newWidth
      canvas.height = newHeight

      ctx?.drawImage(img, 0, 0, newWidth, newHeight)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha no redimensionamento'))
            return
          }

          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          resolve(resizedFile)
        },
        file.type,
        0.9
      )
    }

    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Corta uma imagem baseado na área especificada
 */
export const cropImage = async (
  file: File,
  cropArea: CropArea
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = cropArea.width
      canvas.height = cropArea.height

      ctx?.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Falha no crop da imagem'))
            return
          }

          const croppedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })

          resolve(croppedFile)
        },
        file.type,
        0.9
      )
    }

    img.onerror = () => reject(new Error('Erro ao carregar imagem'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Converte arquivo para Data URL para preview
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Gera thumbnail quadrado de uma imagem
 */
export const generateThumbnail = async (
  file: File,
  size: number = 150
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = size
      canvas.height = size

      // Calcular crop para fazer quadrado
      const dimension = Math.min(img.width, img.height)
      const offsetX = (img.width - dimension) / 2
      const offsetY = (img.height - dimension) / 2

      ctx?.drawImage(
        img,
        offsetX,
        offsetY,
        dimension,
        dimension,
        0,
        0,
        size,
        size
      )

      resolve(canvas.toDataURL(file.type, 0.8))
    }

    img.onerror = () => reject(new Error('Erro ao gerar thumbnail'))
    img.src = URL.createObjectURL(file)
  })
}
