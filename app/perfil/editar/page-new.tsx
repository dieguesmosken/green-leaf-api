"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || ""
      })
    }
  }, [user])

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: imageUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUser(formData)
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      })
      router.push("/perfil")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar perfil. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Você precisa estar logado para editar seu perfil.
              </p>
              <Button 
                onClick={() => router.push("/login")} 
                className="w-full mt-4"
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header da página */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Editar Perfil</h1>
              <p className="text-muted-foreground">
                Atualize suas informações pessoais
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha suas informações atualizadas para uma melhor experiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload da foto de perfil */}
                <ImageUpload
                  currentImage={formData.avatar}
                  onImageChange={handleImageChange}
                  fallbackText={formData.name?.charAt(0)?.toUpperCase() || "U"}
                  label="Foto de Perfil"
                  size="lg"
                  disabled={isLoading}
                />

                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Conte um pouco sobre você..."
                    rows={4}
                    maxLength={500}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 caracteres
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
