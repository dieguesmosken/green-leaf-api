"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FirebaseUploader } from "@/components/uploads/firebase-uploader"
import { UploadManager } from "@/components/uploads/upload-manager"
import { UploadedFile } from "@/lib/firebase-storage-service"
import { uploadMetadataService } from "@/lib/firebase-upload-metadata-service"
import { useAuth } from "@/context/firebase-auth-context"
import { Upload, FolderOpen, BarChart3, User, FileText } from "lucide-react"

export default function UploadsPage() {
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([])
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    images: 0,
    documents: 0,
    totalSize: 0
  })
  const { user, firebaseUser } = useAuth()

  // Carregar estatísticas reais do usuário
  useEffect(() => {
    if (firebaseUser) {
      loadUserStats()
    }
  }, [firebaseUser])

  const loadUserStats = async () => {
    if (!firebaseUser) return
    
    try {
      const stats = await uploadMetadataService.getUserUploadStats(firebaseUser.uid)
      setUploadStats({
        total: stats.totalFiles,
        images: stats.imageCount,
        documents: stats.documentCount,
        totalSize: stats.totalSize
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const handleUploadComplete = (files: UploadedFile[]) => {
    setRecentUploads(prev => [...files, ...prev].slice(0, 10))
    // Recarregar estatísticas
    loadUserStats()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Sistema de Uploads" text="Gerencie seus arquivos no Firebase Cloud Storage" />
      
      <div className="space-y-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadStats.total}</div>
              <p className="text-xs text-muted-foreground">arquivos enviados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Imagens</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadStats.images}</div>
              <p className="text-xs text-muted-foreground">imagens enviadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uploadStats.documents}</div>
              <p className="text-xs text-muted-foreground">documentos enviados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espaço Usado</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(uploadStats.totalSize)}</div>
              <p className="text-xs text-muted-foreground">espaço utilizado</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Upload e Gerenciamento */}
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Novo Upload
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Análises
            </TabsTrigger>
            <TabsTrigger value="avatars" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Avatares
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Geral
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upload para Análises */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Upload para Análises
                  </CardTitle>
                  <CardDescription>
                    Envie imagens e dados para análise de plantas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FirebaseUploader
                    folder="analyses"
                    acceptedTypes={['image/*', '.csv', '.json']}
                    maxFiles={5}
                    onUploadComplete={handleUploadComplete}
                  />
                </CardContent>
              </Card>

              {/* Upload Geral */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Geral
                  </CardTitle>
                  <CardDescription>
                    Envie documentos e arquivos diversos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FirebaseUploader
                    folder="general"
                    acceptedTypes={['image/*', '.pdf', '.csv', '.json', '.txt']}
                    maxFiles={10}
                    onUploadComplete={handleUploadComplete}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Uploads Recentes */}
            {recentUploads.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploads Recentes</CardTitle>
                  <CardDescription>
                    Arquivos enviados na sessão atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentUploads.slice(0, 5).map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analyses">
            <UploadManager folder="analyses" />
          </TabsContent>

          <TabsContent value="avatars">
            <UploadManager folder="avatars" />
          </TabsContent>          <TabsContent value="general">
            <UploadManager folder="general" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
