"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, X, User } from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"
import { uploadUserAvatar } from "@/lib/firebase-utils"
import { uploadAvatarAlternative } from "@/lib/upload-alternative"

export function AvatarUpload() {
  const { user, firebaseUser, updateUser, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Verificar se pode fazer upload
  const canUpload = !authLoading && firebaseUser && user && selectedFile

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione apenas arquivos de imagem")
      return
    }

    // Validar tamanho (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5MB")
      return
    }

    setError("")
    setSelectedFile(file)    // Criar preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleUpload = async () => {
    if (!canUpload) {
      setError("Aguarde o carregamento da autenticação ou selecione um arquivo")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      console.log("🚀 Iniciando upload de avatar para usuário:", firebaseUser.uid)

      // Tentar primeiro com a função padrão
      let imageUrl: string
      
      try {
        console.log("📤 Tentativa 1: Upload padrão")
        imageUrl = await uploadUserAvatar(firebaseUser.uid, selectedFile)
      } catch (primaryError: any) {
        console.log("❌ Upload padrão falhou:", primaryError.message)
        
        if (primaryError.message.includes('unauthenticated') || primaryError.code === 'storage/unauthenticated') {
          console.log("🔄 Tentativa 2: Upload alternativo")
          imageUrl = await uploadAvatarAlternative(firebaseUser.uid, selectedFile)
        } else {
          throw primaryError
        }
      }

      console.log("✅ Upload concluído, atualizando perfil com URL:", imageUrl)

      // Atualizar perfil do usuário
      await updateUser({ image: imageUrl })

      // Limpar estado
      setPreview(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      console.log("🎉 Avatar atualizado com sucesso!")
    } catch (error: any) {
      console.error("❌ Erro no upload do avatar:", error)
      setError(error.message || "Erro desconhecido ao fazer upload")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setPreview(null)
    setSelectedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const getUserInitials = () => {
    return user?.name?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Foto do Perfil
        </CardTitle>
        <CardDescription>
          Personalize seu perfil com uma foto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar atual ou preview */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={preview || user?.image} 
                alt={user?.name || "Avatar"} 
              />
              <AvatarFallback className="text-lg">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Botão de câmera */}
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0"
              onClick={triggerFileSelect}
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Input de arquivo hidden */}
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <Alert variant="destructive" className="w-full">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Informações do arquivo selecionado */}
          {selectedFile && (
            <div className="w-full space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Arquivo selecionado:</p>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={isLoading || !canUpload}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : !canUpload ? (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Aguardando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Salvar Foto
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Botão para selecionar arquivo quando não há preview */}
          {!selectedFile && (
            <Button
              variant="outline"
              onClick={triggerFileSelect}
              disabled={isLoading}
              className="w-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              Escolher Foto
            </Button>
          )}

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Formatos aceitos: JPG, PNG, GIF
            </p>
            <p className="text-xs text-gray-500">
              Tamanho máximo: 5MB
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
