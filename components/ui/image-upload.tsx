"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, X } from "lucide-react"
import { uploadToImgur, validateImageFile } from "@/lib/imgur"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  fallbackText?: string
  label?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-20 w-20", 
  lg: "h-32 w-32"
}

export function ImageUpload({
  currentImage,
  onImageChange,
  fallbackText = "U",
  label = "Foto de Perfil",
  size = "md",
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar arquivo
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast({
        title: "Erro",
        description: validation.error,
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      const imageUrl = await uploadToImgur(file)
      onImageChange(imageUrl)
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso!"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao carregar a imagem.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }

    // Reset input
    event.target.value = ""
  }

  const handleRemoveImage = () => {
    onImageChange("")
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida com sucesso."
    })
  }

  return (
    <div className="flex items-center gap-6">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={currentImage} alt="Avatar" />
        <AvatarFallback className="text-lg">
          {fallbackText}
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading || disabled}
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Carregando..." : "Alterar Foto"}
          </Button>
          
          {currentImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={handleRemoveImage}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Remover
            </Button>
          )}
          
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG, GIF ou WebP. Máximo 10MB.
        </p>
      </div>
    </div>
  )
}
