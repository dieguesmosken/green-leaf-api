"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Loader2, X, Crop, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { uploadToImgur, validateImageFile } from "@/lib/imgur"
import { compressImage, resizeImage, fileToDataURL, generateThumbnail } from "@/lib/image-processing"
import { imageCache } from "@/lib/image-cache"
import { useToast } from "@/hooks/use-toast"

interface AdvancedImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string, thumbnail?: string) => void
  fallbackText?: string
  label?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  enableCrop?: boolean
  enableCompression?: boolean
  maxSizeKB?: number
  cropAspectRatio?: number // 1 para quadrado, 16/9 para widescreen, etc.
}

interface CropState {
  x: number
  y: number
  width: number
  height: number
  scale: number
  rotation: number
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-20 w-20", 
  lg: "h-32 w-32"
}

export function AdvancedImageUpload({
  currentImage,
  onImageChange,
  fallbackText = "U",
  label = "Foto de Perfil",
  size = "md",
  disabled = false,
  enableCrop = true,
  enableCompression = true,
  maxSizeKB = 500,
  cropAspectRatio = 1 // Quadrado por padrão
}: AdvancedImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [cropState, setCropState] = useState<CropState>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    rotation: 0
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const { toast } = useToast()

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setOriginalFile(file)
    
    if (enableCrop) {
      // Mostrar dialog de crop
      const dataUrl = await fileToDataURL(file)
      setPreviewUrl(dataUrl)
      setShowCropDialog(true)
      
      // Inicializar crop state baseado nas dimensões da imagem
      const img = new Image()
      img.onload = () => {
        const size = Math.min(img.width, img.height)
        setCropState({
          x: (img.width - size) / 2,
          y: (img.height - size) / 2,
          width: size,
          height: size / cropAspectRatio,
          scale: 1,
          rotation: 0
        })
      }
      img.src = dataUrl
    } else {
      // Upload direto
      await processAndUpload(file)
    }

    // Reset input
    event.target.value = ""
  }

  const drawImageOnCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Aplicar transformações
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((cropState.rotation * Math.PI) / 180)
    ctx.scale(cropState.scale, cropState.scale)
    
    // Desenhar imagem
    ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    )
    
    ctx.restore()

    // Desenhar área de crop
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(cropState.x, cropState.y, cropState.width, cropState.height)
  }, [cropState])

  const handleCropConfirm = async () => {
    if (!originalFile) return

    setIsProcessing(true)
    try {
      // Criar canvas para crop
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      await new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.src = previewUrl
      })

      // Configurar canvas com dimensões do crop
      canvas.width = cropState.width
      canvas.height = cropState.height

      // Aplicar transformações e fazer crop
      ctx?.save()
      ctx?.translate(canvas.width / 2, canvas.height / 2)
      ctx?.rotate((cropState.rotation * Math.PI) / 180)
      ctx?.scale(cropState.scale, cropState.scale)
      
      ctx?.drawImage(
        img,
        cropState.x - canvas.width / 2,
        cropState.y - canvas.height / 2,
        img.width,
        img.height
      )
      
      ctx?.restore()

      // Converter canvas para file
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), originalFile.type, 0.9)
      })

      const croppedFile = new File([blob], originalFile.name, {
        type: originalFile.type,
        lastModified: Date.now()
      })

      setShowCropDialog(false)
      await processAndUpload(croppedFile)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar a imagem",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const processAndUpload = async (file: File) => {
    setIsUploading(true)

    try {
      let processedFile = file

      // Compressão automática se habilitada
      if (enableCompression) {
        processedFile = await compressImage(file, {
          maxWidth: 1024,
          maxHeight: 1024,
          quality: 0.8,
          maxSizeKB
        })
      }

      // Upload para Imgur
      const imageUrl = await uploadToImgur(processedFile)
      
      // Gerar thumbnail se necessário
      const thumbnail = await generateThumbnail(processedFile, 150)
      
      // Salvar no cache
      const blob = new Blob([processedFile], { type: processedFile.type })
      await imageCache.set(imageUrl, blob)
      
      onImageChange(imageUrl, thumbnail)
      
      toast({
        title: "Sucesso",
        description: "Imagem carregada e processada com sucesso!"
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
  }

  const handleRemoveImage = async () => {
    if (currentImage) {
      await imageCache.remove(currentImage)
    }
    onImageChange("")
    toast({
      title: "Imagem removida",
      description: "A imagem foi removida com sucesso."
    })
  }

  const rotateCrop = () => {
    setCropState(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))
  }

  const updateScale = (value: number[]) => {
    setCropState(prev => ({ ...prev, scale: value[0] }))
  }

  return (
    <>
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
              disabled={isUploading || isProcessing || disabled}
              onClick={() => document.getElementById('advanced-image-upload')?.click()}
              className="flex items-center gap-2"
            >
              {isUploading || isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? "Enviando..." : isProcessing ? "Processando..." : "Alterar Foto"}
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
              id="advanced-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, GIF ou WebP. Máximo 10MB.
            {enableCompression && ` Compressão automática ativada.`}
            {enableCrop && ` Edição de imagem disponível.`}
          </p>
        </div>
      </div>

      {/* Dialog de Crop */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview da imagem */}
            <div className="relative border rounded-lg overflow-hidden bg-gray-100">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-96 mx-auto"
                width={400}
                height={400}
              />
              
              {previewUrl && (
                <img
                  ref={imageRef}
                  src={previewUrl}
                  alt="Preview"
                  className="hidden"
                  onLoad={drawImageOnCanvas}
                />
              )}
            </div>

            {/* Controles */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-sm font-medium">Zoom:</Label>
                <div className="flex items-center gap-2 flex-1">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[cropState.scale]}
                    onValueChange={updateScale}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground min-w-12">
                  {Math.round(cropState.scale * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={rotateCrop}
                  className="flex items-center gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Girar 90°
                </Button>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCropDialog(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCropConfirm}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Crop className="mr-2 h-4 w-4" />
                    Aplicar
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
