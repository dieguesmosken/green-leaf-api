"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useFirebaseStorage } from "@/hooks/use-firebase"
import { Upload, X, FileImage, Check } from "lucide-react"
import Image from "next/image"

interface UploadedFile {
  id: string
  file: File
  preview: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  url?: string
  error?: string
}

interface ImageUploadProps {
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  folder?: string
}

export function ImageUpload({ onUploadComplete, maxFiles = 5, folder = "uploads" }: ImageUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const { uploadFile, isUploading } = useFirebaseStorage()
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading' as const,
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])

    // Fazer upload de cada arquivo
    newFiles.forEach(uploadFileHandler)
  }, [])

  const uploadFileHandler = async (fileData: UploadedFile) => {
    try {
      // Simular progresso
      for (let progress = 0; progress <= 100; progress += 20) {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, progress } : f
        ))
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Upload para Firebase Storage
      const url = await uploadFile(fileData.file, `${folder}/`)

      setFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, status: 'success', progress: 100, url }
          : f
      ))

      toast({
        title: "Upload concluído",
        description: `Arquivo ${fileData.file.name} enviado com sucesso.`,
      })

    } catch (error) {
      console.error('Upload error:', error)
      
      setFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Erro no upload' }
          : f
      ))

      toast({
        title: "Erro no upload",
        description: `Falha ao enviar ${fileData.file.name}.`,
        variant: "destructive",
      })
    }
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleComplete = () => {
    const successUrls = files
      .filter(f => f.status === 'success' && f.url)
      .map(f => f.url!)
    
    if (onUploadComplete) {
      onUploadComplete(successUrls)
    }

    // Limpar arquivos
    files.forEach(f => URL.revokeObjectURL(f.preview))
    setFiles([])

    toast({
      title: "Upload finalizado",
      description: `${successUrls.length} arquivo(s) processado(s) com sucesso.`,
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  })

  const successCount = files.filter(f => f.status === 'success').length
  const allComplete = files.length > 0 && files.every(f => f.status !== 'uploading')

  return (
    <div className="space-y-4">
      {/* Área de Drop */}
      {files.length < maxFiles && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? 'Solte as imagens aqui' : 'Envie imagens das folhas'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Arraste e solte ou clique para selecionar imagens<br />
                PNG, JPG, GIF até 10MB cada
              </p>
              <Button variant="outline">
                Selecionar Arquivos
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {files.length}/{maxFiles} arquivos
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Arquivos</h3>
                {allComplete && successCount > 0 && (
                  <Button onClick={handleComplete} size="sm">
                    <Check className="h-4 w-4 mr-2" />
                    Finalizar ({successCount})
                  </Button>
                )}
              </div>

              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {/* Preview da Imagem */}
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Informações do Arquivo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FileImage className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">
                        {file.file.name}
                      </span>
                      <Badge variant={
                        file.status === 'success' ? 'default' : 
                        file.status === 'error' ? 'destructive' : 
                        'secondary'
                      }>
                        {file.status === 'uploading' ? 'Enviando' : 
                         file.status === 'success' ? 'Sucesso' : 
                         'Erro'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="h-2" />
                    )}

                    {file.status === 'error' && (
                      <p className="text-xs text-destructive">
                        {file.error}
                      </p>
                    )}

                    {file.status === 'success' && file.url && (
                      <p className="text-xs text-green-600">
                        Upload concluído
                      </p>
                    )}
                  </div>

                  {/* Botão Remover */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
