"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileIcon, ImageIcon, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { storageService, UploadProgress, UploadedFile } from "@/lib/firebase-storage-service"
import { cn } from "@/lib/utils"

interface FileUploadItem {
  file: File
  id: string
  progress: UploadProgress
  preview?: string
  uploaded?: UploadedFile
}

interface FirebaseUploaderProps {
  onUploadComplete?: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  folder?: 'analyses' | 'avatars' | 'general'
  className?: string
}

export function FirebaseUploader({
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = ['image/*', '.pdf', '.csv', '.json'],
  folder = 'general',
  className
}: FirebaseUploaderProps) {
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }, [])

  const addFiles = (files: File[]) => {
    setError(null)

    // Verificar limite de arquivos
    if (uploadItems.length + files.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    const newItems: FileUploadItem[] = files.map(file => {
      const validation = storageService.validateFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Arquivo inválido')
        return null
      }

      return {
        file,
        id: `${Date.now()}-${file.name}`,
        progress: { progress: 0, status: 'uploading' as const },
        preview: storageService.getPreviewUrl(file) || undefined
      }
    }).filter(Boolean) as FileUploadItem[]

    setUploadItems(prev => [...prev, ...newItems])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id))
  }

  const uploadFiles = async () => {
    if (uploadItems.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const uploadPromises = uploadItems.map(async (item, index) => {
        if (item.uploaded) return item.uploaded

        const uploadedFile = await storageService.uploadFile(
          item.file,
          folder,
          (progress) => {
            setUploadItems(prev => prev.map(prevItem => 
              prevItem.id === item.id 
                ? { ...prevItem, progress }
                : prevItem
            ))
          }
        )

        setUploadItems(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, uploaded: uploadedFile }
            : prevItem
        ))

        return uploadedFile
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      onUploadComplete?.(uploadedFiles)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Erro durante o upload. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const clearAll = () => {
    setUploadItems([])
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload de Arquivos
        </CardTitle>
        <CardDescription>
          Arraste arquivos ou clique para selecionar. Máximo {maxFiles} arquivos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Área de drop */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            uploadItems.length > 0 && "border-muted-foreground/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragging ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para selecionar"}
          </p>
          <p className="text-sm text-muted-foreground">
            Tipos aceitos: {acceptedTypes.join(', ')}
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Lista de arquivos */}
        {uploadItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Arquivos selecionados ({uploadItems.length})</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar tudo
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                >
                  {/* Preview */}
                  <div className="flex-shrink-0">
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-muted rounded">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Informações do arquivo */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(item.file.size)}
                    </p>
                    
                    {/* Progress bar */}
                    {item.progress.status !== 'completed' && item.progress.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={item.progress.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(item.progress.progress)}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {item.uploaded ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Enviado
                      </Badge>
                    ) : item.progress.status === 'error' ? (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Erro
                      </Badge>
                    ) : item.progress.status === 'uploading' && item.progress.progress > 0 ? (
                      <Badge variant="secondary">
                        Enviando...
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Aguardando
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(item.id)}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={uploadFiles}
                disabled={isUploading || uploadItems.every(item => item.uploaded)}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar arquivos
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
