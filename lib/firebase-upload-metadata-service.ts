"use client"

import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy, limit } from "firebase/firestore"
import { UploadedFile } from "./firebase-storage-service"

export interface UploadMetadata extends UploadedFile {
  tags?: string[]
  description?: string
  category?: string
  isPublic?: boolean
}

export class FirebaseUploadMetadataService {
  private static instance: FirebaseUploadMetadataService
  private collectionName = "uploads"

  public static getInstance(): FirebaseUploadMetadataService {
    if (!FirebaseUploadMetadataService.instance) {
      FirebaseUploadMetadataService.instance = new FirebaseUploadMetadataService()
    }
    return FirebaseUploadMetadataService.instance
  }

  /**
   * Salvar metadados do upload no Firestore
   */
  async saveUploadMetadata(uploadData: UploadMetadata): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...uploadData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error("Error saving upload metadata:", error)
      throw error
    }
  }

  /**
   * Buscar uploads do usuário
   */
  async getUserUploads(
    userId: string, 
    folder?: string, 
    limitCount: number = 50
  ): Promise<UploadMetadata[]> {
    try {
      let q = query(
        collection(db, this.collectionName),
        where("userId", "==", userId),
        orderBy("uploadedAt", "desc"),
        limit(limitCount)
      )

      if (folder) {
        q = query(
          collection(db, this.collectionName),
          where("userId", "==", userId),
          where("path", ">=", `${folder}/${userId}/`),
          where("path", "<", `${folder}/${userId}/\uf8ff`),
          orderBy("path"),
          orderBy("uploadedAt", "desc"),
          limit(limitCount)
        )
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UploadMetadata))
    } catch (error) {
      console.error("Error fetching user uploads:", error)
      return []
    }
  }

  /**
   * Buscar uploads por categoria
   */
  async getUploadsByCategory(
    userId: string, 
    category: string,
    limitCount: number = 20
  ): Promise<UploadMetadata[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("userId", "==", userId),
        where("category", "==", category),
        orderBy("uploadedAt", "desc"),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UploadMetadata))
    } catch (error) {
      console.error("Error fetching uploads by category:", error)
      return []
    }
  }

  /**
   * Deletar metadados do upload
   */
  async deleteUploadMetadata(documentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, documentId))
    } catch (error) {
      console.error("Error deleting upload metadata:", error)
      throw error
    }
  }

  /**
   * Buscar uploads recentes do usuário
   */
  async getRecentUploads(userId: string, limitCount: number = 10): Promise<UploadMetadata[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("userId", "==", userId),
        orderBy("uploadedAt", "desc"),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UploadMetadata))
    } catch (error) {
      console.error("Error fetching recent uploads:", error)
      return []
    }
  }

  /**
   * Obter estatísticas de upload do usuário
   */
  async getUserUploadStats(userId: string): Promise<{
    totalFiles: number
    totalSize: number
    imageCount: number
    documentCount: number
    categories: Record<string, number>
  }> {
    try {
      const uploads = await this.getUserUploads(userId, undefined, 1000)
      
      const stats = {
        totalFiles: uploads.length,
        totalSize: uploads.reduce((acc, upload) => acc + upload.size, 0),
        imageCount: uploads.filter(upload => upload.type.startsWith('image/')).length,
        documentCount: uploads.filter(upload => !upload.type.startsWith('image/')).length,
        categories: {} as Record<string, number>
      }

      // Contar por categoria
      uploads.forEach(upload => {
        const category = upload.category || 'uncategorized'
        stats.categories[category] = (stats.categories[category] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error("Error getting upload stats:", error)
      return {
        totalFiles: 0,
        totalSize: 0,
        imageCount: 0,
        documentCount: 0,
        categories: {}
      }
    }
  }
}

export const uploadMetadataService = FirebaseUploadMetadataService.getInstance()
