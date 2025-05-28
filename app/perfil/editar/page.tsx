"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import { v4 as uuidv4 } from "uuid"
import { MaskInput } from "maska"

// Componente de Input com máscara usando maska
function MaskedInput({ mask, value, onChange, placeholder, className, ...props }: {
  mask: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!inputRef.current) return;
    
    const maskaInstance = new MaskInput(inputRef.current, {
      mask,
      tokens: {
        '9': { pattern: /\d/ },
      }
    });
    
    return () => {
      maskaInstance.destroy();
    };
  }, [mask, inputRef]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  );
}

// Interface para endereços
interface Address {
  id: string;
  label: string;
  name: string;
  address: string;
  city: string;
  state: string;  postalCode: string;
}

function EditProfilePageContent() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [avatar, setAvatar] = useState(user?.image || "")
  const [avatarPreview, setAvatarPreview] = useState(user?.image || "")
  const [isUploading, setIsUploading] = useState(false)
  
  // Estados para endereços
  const [addresses, setAddresses] = useState<Address[]>([])
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    label: "",
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: ""
  })

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/perfil/editar")
    } else {
      setFormData({
        name: user.name,
        email: user.email,
      })
      setAvatar(user.image || "")
      // Carregar endereços do usuário se existirem
      setAddresses(user.endereco || [])
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setIsUploading(true)
    const formData = new FormData()
    formData.append("image", file)
    try {
      const res = await fetch("/api/upload-avatar", { method: "POST", body: formData })
      if (!res.ok) {
        const errText = await res.text()
        toast.error(`Erro ao enviar imagem: ${errText}`)
        setIsUploading(false)
        return
      }
      const data = await res.json()
      if (data.url) {
        setAvatar(data.url)
        setAvatarPreview(data.url)
        toast.success("Imagem enviada com sucesso!")
      } else {
        toast.error("Erro ao enviar imagem: resposta inválida do servidor")
      }
    } catch (err: any) {
      toast.error(`Erro ao enviar imagem: ${err?.message || err}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar("")
    setAvatarPreview("")
  }

  // Funções para gerenciar endereços
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address) return
    
    const addressWithId: Address = {
      ...newAddress,
      id: uuidv4()
    }
    
    setAddresses([...addresses, addressWithId])
    setNewAddress({
      label: "",
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: ""
    })
  }

  const handleRemoveAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          image: avatar,
          addresses: addresses 
        }),
      })
      if (!res.ok) throw new Error("Erro ao atualizar perfil")
      const updated = await res.json()
      await updateUser(updated)
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
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={avatarPreview || avatar || "/placeholder-user.jpg"}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border shadow"
                  />
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="avatar">Foto de Perfil</Label>
                    <Input id="avatar" name="avatar" type="file" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
                    <div className="flex gap-2 mt-1">
                      {isUploading && <span className="text-xs text-muted-foreground">Enviando...</span>}
                      {(avatar || avatarPreview) && (
                        <Button type="button" size="sm" variant="destructive" onClick={handleRemoveAvatar}>Remover</Button>
                      )}
                    </div>
                  </div>
                </div>
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
                {/* Endereços */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-2 text-lg">Endereços</h3>
                  {addresses.length === 0 && <p className="text-muted-foreground text-sm mb-2">Nenhum endereço cadastrado.</p>}
                  <ul className="space-y-2 mb-2">
                    {addresses.map((addr, idx) => (
                      <li key={addr.id || idx} className="flex flex-col md:flex-row md:items-center md:gap-4 border rounded p-2 bg-muted/30">
                        <div className="flex-1">
                          <span className="font-medium">{addr.label || "Endereço"}</span>: {addr.name}, {addr.address}, {addr.city}, {addr.state}, {addr.postalCode}
                        </div>
                        <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveAddress(addr.id)}>Remover</Button>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2">
                    <Input placeholder="Apelido" value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })} className="md:col-span-1" />
                    <Input placeholder="Nome" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} className="md:col-span-1" />
                    <Input placeholder="Endereço" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} className="md:col-span-1" />
                    <Input placeholder="Cidade" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} className="md:col-span-1" />
                    <Input placeholder="Estado" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} className="md:col-span-1" />
                    <MaskedInput
                      mask="99999-999"
                      value={newAddress.postalCode}
                      onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      placeholder="CEP"
                      className="md:col-span-1"
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddAddress} disabled={!newAddress.name || !newAddress.address}>Adicionar Endereço</Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function EditProfilePage() {
  return (
    <AuthGuard>
      <EditProfilePageContent />
    </AuthGuard>
  )
}