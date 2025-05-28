"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FileUp, Upload, Check, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploader, UploadResult } from "@/lib/multi-upload"
import { useUploadContext } from "@/context/upload-context"
import { toast } from "sonner"

interface QuickUploadProps {
  onUploadComplete?: (result: UploadResult) => void
  className?: string
}

export function QuickUpload({ onUploadComplete, className }: QuickUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addUpload } = useUploadContext()

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadResult(null)

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploader.upload(file)
        clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadResult(result)
      
      // Adicionar ao contexto
      addUpload(file, result)
      
      if (result.success) {
        toast.success("Upload realizado com sucesso!")
        onUploadComplete?.(result)
        setTimeout(() => {
          setIsOpen(false)
          resetUpload()
        }, 2000)
      } else {
        toast.error(`Erro no upload: ${result.error || "Erro desconhecido"}`)
      }
    } catch (error) {
      console.error("Erro no upload:", error)
      toast.error("Erro inesperado durante o upload")
      setUploadResult({
        success: false,
        error: "Erro inesperado",
        provider: "unknown"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setUploadProgress(0)
    setUploadResult(null)
    setIsUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const UploadStatus = () => {
    if (!uploadResult) return null

    if (uploadResult.success) {
      return (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Upload realizado com sucesso via {uploadResult.provider}!
            {uploadResult.url && (
              <div className="mt-2">
                <a 
                  href={uploadResult.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver imagem
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )
    } else {
      return (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Falha no upload: {uploadResult.error}
            {uploadResult.provider && (
              <div className="text-sm mt-1">
                Provedor: {uploadResult.provider}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetUpload()
    }}>
      <DialogTrigger asChild>
        <Button className={cn("", className)}>
          <FileUp className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Rápido de Imagem</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Área de Upload */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300",
              isUploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {isUploading ? "Enviando..." : "Arraste uma imagem ou clique para selecionar"}
            </p>
            <p className="text-sm text-gray-500">
              Suporta JPG, PNG, GIF até 10MB
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
              disabled={isUploading}
            />
          </div>

          {/* Barra de Progresso */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviando...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Status do Upload */}
          <UploadStatus />

          {/* Botões */}
          <div className="flex justify-end gap-2">
            {uploadResult?.success && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  resetUpload()
                }}
              >
                Fechar
              </Button>
            )}
            {!isUploading && !uploadResult?.success && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  resetUpload()
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
