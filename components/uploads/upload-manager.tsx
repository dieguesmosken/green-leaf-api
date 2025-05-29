"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  FileIcon, 
  ImageIcon, 
  Download, 
  Trash2, 
  Search, 
  Filter,
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react"
import { storageService, UploadedFile } from "@/lib/firebase-storage-service"
import { uploadMetadataService } from "@/lib/firebase-upload-metadata-service"
import { useAuth } from "@/context/firebase-auth-context"
import { cn } from "@/lib/utils"

interface UploadManagerProps {
  folder?: 'analyses' | 'avatars' | 'general'
  className?: string
}

export function UploadManager({ folder = 'general', className }: UploadManagerProps) {
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [filteredUploads, setFilteredUploads] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date")
  const { user } = useAuth()

  useEffect(() => {
    loadUploads()
  }, [folder])

  useEffect(() => {
    filterAndSortUploads()
  }, [uploads, searchTerm, typeFilter, sortBy])
  const loadUploads = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Buscar uploads reais do Firestore
      const userUploads = await storageService.listUserFiles(folder)
      setUploads(userUploads)
    } catch (error) {
      console.error('Error loading uploads:', error)
      setError('Erro ao carregar uploads')
      setUploads([]) // Fallback para lista vazia
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortUploads = () => {
    let filtered = uploads

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(upload =>
        upload.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter(upload =>
        upload.type.startsWith(typeFilter)
      )
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.size - a.size
        case "date":
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
    })

    setFilteredUploads(filtered)
  }

  const handleDelete = async (upload: UploadedFile) => {
    if (!confirm(`Tem certeza que deseja deletar "${upload.name}"?`)) {
      return
    }

    try {
      await storageService.deleteFile(upload.path)
      setUploads(prev => prev.filter(u => u.id !== upload.id))
    } catch (error) {
      console.error('Error deleting file:', error)
      setError('Erro ao deletar arquivo')
    }
  }

  const handleDownload = (upload: UploadedFile) => {
    const link = document.createElement('a')
    link.href = upload.url
    link.download = upload.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (upload: UploadedFile) => {
    window.open(upload.url, '_blank')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />
    }
    return <FileIcon className="h-5 w-5" />
  }

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) return 'bg-blue-100 text-blue-800'
    if (type.includes('pdf')) return 'bg-red-100 text-red-800'
    if (type.includes('csv')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Carregando uploads...
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Gerenciar Uploads</span>
          <Button variant="outline" size="sm" onClick={loadUploads}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </CardTitle>
        <CardDescription>
          Gerencie seus arquivos enviados para o {folder === 'general' ? 'geral' : folder}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo de arquivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="image">Imagens</SelectItem>
              <SelectItem value="application">Documentos</SelectItem>
              <SelectItem value="text">Texto</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: "name" | "date" | "size") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="size">Tamanho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de arquivos */}
        {filteredUploads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {uploads.length === 0 ? "Nenhum arquivo encontrado" : "Nenhum arquivo corresponde aos filtros"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Ícone */}
                <div className="flex-shrink-0">
                  {getFileIcon(upload.type)}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{upload.name}</p>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getFileTypeColor(upload.type))}
                    >
                      {upload.type.split('/')[1]?.toUpperCase() || 'FILE'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatFileSize(upload.size)}</span>
                    <span>{formatDate(upload.uploadedAt)}</span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(upload)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(upload)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(upload)}
                    title="Deletar"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
