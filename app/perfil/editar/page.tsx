"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/perfil/editar")
    } else {
      setFormData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser(formData)
      toast.success("Informações atualizadas com sucesso!")
      router.push("/perfil")
    } catch (err) {
      toast.error("Erro ao atualizar perfil.")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container max-w-xl">
          <h1 className="text-3xl font-bold mb-6">Editar Informações</h1>
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Atualize seus dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.push("/perfil")}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
