"use client"

import { storage, auth } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import { v4 as uuidv4 } from "uuid"
import { uploadMetadataService, UploadMetadata } from "./firebase-upload-metadata-service"

export interface UploadProgress {
  progress: number
  status: 'uploading' | 'completed' | 'error' | 'paused'
  error?: string
}

export interface UploadedFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedAt: Date
  userId: string
  path: string
}

export class FirebaseStorageService {
  private static instance: FirebaseStorageService
  
  public static getInstance(): FirebaseStorageService {
    if (!FirebaseStorageService.instance) {
      FirebaseStorageService.instance = new FirebaseStorageService()
    }
    return FirebaseStorageService.instance
  }
  /**
   * Upload um arquivo para o Firebase Storage
   */
  async uploadFile(
    file: File,
    folder: 'analyses' | 'avatars' | 'general' = 'general',
    onProgress?: (progress: UploadProgress) => void,
    metadata?: { tags?: string[], description?: string, category?: string }
  ): Promise<UploadedFile> {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado')
    }

    const userId = auth.currentUser.uid
    const fileId = uuidv4()
    const fileName = `${fileId}_${file.name}`
    const filePath = `${folder}/${userId}/${fileName}`
    
    const storageRef = ref(storage, filePath)
    const uploadTask = uploadBytesResumable(storageRef, file)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.({
            progress,
            status: 'uploading'
          })
        },
        (error) => {
          console.error('Upload error:', error)
          onProgress?.({
            progress: 0,
            status: 'error',
            error: error.message
          })
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            
            const uploadedFile: UploadedFile = {
              id: fileId,
              name: file.name,
              url: downloadURL,
              size: file.size,
              type: file.type,
              uploadedAt: new Date(),
              userId,
              path: filePath
            }

            // Salvar metadados no Firestore
            try {
              const uploadMetadata: UploadMetadata = {
                ...uploadedFile,
                tags: metadata?.tags || [],
                description: metadata?.description || '',
                category: metadata?.category || folder,
                isPublic: false
              }
              await uploadMetadataService.saveUploadMetadata(uploadMetadata)
            } catch (metadataError) {
              console.warn('Failed to save metadata:', metadataError)
              // Continua mesmo se falhar ao salvar metadados
            }

            onProgress?.({
              progress: 100,
              status: 'completed'
            })

            resolve(uploadedFile)
          } catch (error) {
            reject(error)
          }
        }
      )
    })
  }

  /**
   * Upload múltiplos arquivos
   */
  async uploadMultipleFiles(
    files: FileList | File[],
    folder: 'analyses' | 'avatars' | 'general' = 'general',
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<UploadedFile[]> {
    const fileArray = Array.from(files)
    const uploadPromises = fileArray.map((file, index) => 
      this.uploadFile(file, folder, (progress) => {
        onProgress?.(index, progress)
      })
    )

    return Promise.all(uploadPromises)
  }

  /**
   * Deletar um arquivo
   */
  async deleteFile(filePath: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado')
    }

    const storageRef = ref(storage, filePath)
    await deleteObject(storageRef)
  }
  /**
   * Listar arquivos do usuário usando Firestore
   */
  async listUserFiles(folder: 'analyses' | 'avatars' | 'general' = 'general'): Promise<UploadedFile[]> {
    if (!auth.currentUser) {
      throw new Error('Usuário não autenticado')
    }

    const userId = auth.currentUser.uid
    
    try {
      const uploads = await uploadMetadataService.getUserUploads(userId, folder)
      return uploads
    } catch (error) {
      console.error('Error listing files:', error)
      return []
    }
  }

  /**
   * Validar arquivo antes do upload
   */
  validateFile(file: File, maxSizeMB: number = 10): { valid: boolean; error?: string } {
    // Verificar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`
      }
    }

    // Verificar tipo de arquivo
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/csv',
      'application/json'
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido'
      }
    }

    return { valid: true }
  }

  /**
   * Obter URL de preview para imagens
   */
  getPreviewUrl(file: File): string | null {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }
}

export const storageService = FirebaseStorageService.getInstance()
