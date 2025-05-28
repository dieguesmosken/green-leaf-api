"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Download, Eye, Calendar, User, MapPin } from "lucide-react"
import { useFirebaseStorage } from "@/hooks/use-firebase"
import { useAuth as useFirebaseAuth } from "@/context/firebase-auth-context"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface UploadedImage {
  id: string
  name: string
  url: string
  uploadedAt: Date
  size: number
  userId: string
  folder: string
  metadata?: {
    location?: string
    analysisStatus?: 'pending' | 'analyzing' | 'completed' | 'failed'
    infectionRate?: number
    severity?: string
  }
}

export function FirebaseUploadsTable() {
  const [uploads, setUploads] = useState<UploadedImage[]>([])
  const [loading, setLoading] = useState(true)
  const { deleteFile, getUserUploads } = useFirebaseStorage()
  const { user } = useFirebaseAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadUploads()
  }, [user])
  const loadUploads = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Buscar uploads reais do Firestore
      const uploadsData = await getUserUploads()
      
      // Mapear para o formato esperado
      const mappedUploads: UploadedImage[] = uploadsData.map((upload: any) => ({
        id: upload.id,
        name: upload.originalName || upload.name,
        url: upload.url,
        uploadedAt: upload.uploadedAt,
        size: upload.size,
        userId: upload.userId,
        folder: upload.folder,
        metadata: upload.metadata || {
          analysisStatus: 'pending'
        }
      }))

      setUploads(mappedUploads)
    } catch (error) {
      console.error('Erro ao carregar uploads:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os uploads.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (upload: UploadedImage) => {
    try {
      // Deletar do Firebase Storage
      await deleteFile(`${upload.folder}/${upload.name}`)
      
      // Remover da lista local
      setUploads(prev => prev.filter(u => u.id !== upload.id))
      
      toast({
        title: "Arquivo deletado",
        description: `${upload.name} foi removido com sucesso.`,
      })
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast({
        title: "Erro",
        description: "Não foi possível deletar o arquivo.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = (upload: UploadedImage) => {
    const link = document.createElement('a')
    link.href = upload.url
    link.download = upload.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Analisado</Badge>
      case 'analyzing':
        return <Badge variant="secondary">Analisando</Badge>
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'severe':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando uploads...</div>
        </CardContent>
      </Card>
    )
  }

  if (uploads.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Nenhum upload encontrado. Faça upload de algumas imagens para começar.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Seus Uploads ({uploads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploads.map((upload) => (
              <Card key={upload.id} className="overflow-hidden">
                <div className="relative h-48 bg-muted">
                  <Image
                    src={upload.url}
                    alt={upload.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(upload.metadata?.analysisStatus)}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium truncate" title={upload.name}>
                      {upload.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {upload.uploadedAt.toLocaleDateString('pt-BR')} às {upload.uploadedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {upload.metadata?.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {upload.metadata.location}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(upload.size)}
                    </div>

                    {upload.metadata?.analysisStatus === 'completed' && (
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="font-medium">Taxa de Infecção:</span>
                          <span className="ml-1">
                            {((upload.metadata.infectionRate || 0) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Severidade:</span>
                          <span className={`ml-1 capitalize ${getSeverityColor(upload.metadata.severity)}`}>
                            {upload.metadata.severity || 'Desconhecido'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{upload.name}</DialogTitle>
                          </DialogHeader>
                          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
                            <Image
                              src={upload.url}
                              alt={upload.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(upload)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(upload)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
