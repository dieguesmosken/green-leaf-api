// Custom hook for Firebase operations
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/firebase-auth-context'
import { toast } from '@/hooks/use-toast'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'

interface UserData {
  email?: string
  name?: string
  role?: string
  lastUpdated?: { seconds: number }
  [key: string]: any
}

interface FirebaseDocument {
  id: string
  title?: string
  description?: string
  demo?: boolean
  [key: string]: any
}

export function useFirebaseStorage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { user } = useAuth()

  const uploadFile = async (file: File, path: string = 'uploads/') => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Criar referência única para o arquivo
      const fileName = `${Date.now()}_${file.name}`
      const storageRef = ref(storage, `${path}${fileName}`)

      // Upload com progresso
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadProgress(progress)
          },
          (error) => {
            console.error('Erro no upload:', error)
            toast({
              title: 'Erro',
              description: 'Falha ao enviar arquivo',
              variant: 'destructive'
            })
            reject(error)
          },
          async () => {
            try {
              // Upload concluído - obter URL de download
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)              // Salvar informações no Firestore
              await addDoc(collection(db, 'uploads'), {
                userId: user.id,
                name: fileName,
                originalName: file.name,
                url: downloadURL,
                size: file.size,
                folder: path,
                uploadedAt: new Date(),
                metadata: {
                  analysisStatus: 'pending'
                }
              })

              toast({
                title: 'Sucesso',
                description: 'Arquivo enviado com sucesso!'
              })

              resolve(downloadURL)
            } catch (error) {
              console.error('Erro ao salvar no Firestore:', error)
              reject(error)
            }
          }
        )
      })

    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteFile = async (filePath: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      // Deletar do Storage
      const fileRef = ref(storage, filePath)
      await deleteObject(fileRef)

      toast({
        title: 'Sucesso',
        description: 'Arquivo removido com sucesso!'
      })
    } catch (error: any) {
      console.error('Erro ao deletar arquivo:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao remover arquivo',
        variant: 'destructive'
      })
      throw error
    }
  }

  const getUserUploads = async () => {
    if (!user) return []

    try {      const q = query(
        collection(db, 'uploads'),
        where('userId', '==', user.id)
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
      }))
    } catch (error) {
      console.error('Erro ao buscar uploads:', error)
      return []
    }
  }

  return {
    uploadFile,
    deleteFile,
    getUserUploads,
    isUploading,
    uploadProgress
  }
}

export function useFirebaseUser() {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      loadUserData()
    } else {
      setUserData(null)
    }
  }, [user])

  const loadUserData = async () => {
    if (!user?.email) return

    setIsLoading(true)
    setError(null)

    try {
      // Mock user data
      const data: UserData = {
        email: user.email,
        name: user.name || 'Usuário',
        role: 'user',
        lastUpdated: { seconds: Date.now() / 1000 }
      }
      setUserData(data)
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido')
      console.error('Erro ao carregar dados do usuário:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (newData: Partial<UserData>) => {
    if (!user?.email) throw new Error('Usuário não logado')

    setIsLoading(true)
    setError(null)

    try {
      setUserData(prev => prev ? { ...prev, ...newData } : newData as UserData)
      
      toast({
        title: 'Sucesso',
        description: 'Dados atualizados com sucesso!'
      })
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido')
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar dados',
        variant: 'destructive'
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    userData,
    updateUser,
    refreshUserData: loadUserData,
    isLoading,
    error
  }
}

export function useFirebaseCollection(collectionName: string) {
  const [data, setData] = useState<FirebaseDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Placeholder data for demo
      const demoData: FirebaseDocument[] = [
        {
          id: 'demo1',
          title: 'Heatmap Demo 1',
          description: 'Exemplo de heatmap para demonstração',
          demo: true,
          createdAt: new Date()
        },
        {
          id: 'demo2', 
          title: 'Heatmap Demo 2',
          description: 'Outro exemplo de heatmap',
          demo: true,
          createdAt: new Date()
        }
      ]

      setData(demoData)
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido')
      console.error(`Erro ao carregar ${collectionName}:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  const addDocument = async (docData: any) => {
    try {
      const newDoc: FirebaseDocument = {
        id: `new-${Date.now()}`,
        ...docData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setData(prev => [...prev, newDoc])

      toast({
        title: 'Sucesso',
        description: 'Documento criado com sucesso!'
      })
      
      return newDoc.id
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar documento',
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateDocument = async (docId: string, updates: any) => {
    try {
      setData(prev => prev.map(doc => 
        doc.id === docId 
          ? { ...doc, ...updates, updatedAt: new Date() }
          : doc
      ))

      toast({
        title: 'Sucesso',
        description: 'Documento atualizado com sucesso!'
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar documento',
        variant: 'destructive'
      })
      throw error
    }
  }

  const deleteDocument = async (docId: string) => {
    try {
      setData(prev => prev.filter(doc => doc.id !== docId))

      toast({
        title: 'Sucesso',
        description: 'Documento removido com sucesso!'
      })
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Falha ao remover documento',
        variant: 'destructive'
      })
      throw error
    }
  }

  useEffect(() => {
    loadData()
  }, [collectionName])

  return {
    data,
    isLoading,
    error,
    loadData,
    addDocument,
    updateDocument,
    deleteDocument,
    refresh: loadData
  }
}
