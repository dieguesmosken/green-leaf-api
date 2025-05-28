"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/firebase-auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { EmailVerification } from "@/components/auth/email-verification"
import { AvatarUpload } from "@/components/auth/avatar-upload"
import { PasswordManager } from "@/components/auth/password-manager"
import { AccountManager } from "@/components/auth/account-manager"
import { ShoppingBag, Star, User, Settings, LogOut, BarChartIcon, Shield, Mail, Camera } from "lucide-react"

export default function ProfilePage() {
  const { user, firebaseUser, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/perfil")
    }
  }, [user, router])

  const getUserInitials = () => {
    return user?.name?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  if (!user) {
    return null
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-background">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Meu Perfil</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas informações pessoais e configurações de segurança.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Sidebar com informações do usuário */}
            <aside className="space-y-6">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage 
                        src={user.image} 
                        alt={user.name || "Avatar"} 
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <Badge variant={firebaseUser?.emailVerified ? "default" : "secondary"}>
                        {firebaseUser?.emailVerified ? "Email Verificado" : "Email Pendente"}
                      </Badge>
                      {user.role === "admin" && (
                        <Badge variant="destructive">Admin</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Menu de navegação */}
              <Card>
                <CardContent className="pt-6">
                  <nav className="space-y-2">
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("overview")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Visão Geral
                    </Button>
                    <Button
                      variant={activeTab === "avatar" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("avatar")}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Foto do Perfil
                    </Button>
                    <Button
                      variant={activeTab === "security" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Segurança
                    </Button>
                    <Button
                      variant={activeTab === "verification" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("verification")}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Verificação
                    </Button>
                    <Button
                      variant={activeTab === "account" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("account")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Conta
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Conteúdo principal */}
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>
                        Suas informações básicas de perfil
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Nome Completo</label>
                          <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tipo de Conta</label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user.role === "admin" ? "Administrador" : "Usuário"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status do Email</label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {firebaseUser?.emailVerified ? "Verificado" : "Pendente de verificação"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild>
                        <Link href="/dashboard">
                          <BarChartIcon className="mr-2 h-4 w-4" />
                          Ir para Dashboard
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="avatar">
                  <AvatarUpload />
                </TabsContent>

                <TabsContent value="security">
                  <PasswordManager />
                </TabsContent>

                <TabsContent value="verification">
                  {!firebaseUser?.emailVerified ? (
                    <EmailVerification />
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-green-600">Email Verificado</CardTitle>
                        <CardDescription>
                          Seu email foi verificado com sucesso!
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-green-600">
                          <Mail className="h-5 w-5" />
                          <span>Verificação concluída em {new Date().toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="account">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Configurações da Conta</CardTitle>
                        <CardDescription>
                          Gerencie as configurações da sua conta
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button onClick={logout} variant="outline" className="w-full">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair da Conta
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <AccountManager />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
                    </Avatar>
                    <h2 className="text-xl font-bold text-primary">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </CardContent>
              </Card>

              <nav className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Informações Pessoais
                  </Link>
                </Button>
              
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/perfil/analises">
                    <Star className="mr-2 h-4 w-4" />
                    Minhas Analises
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link href="/perfil/configuracoes">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </Button>
                {user.role === "admin" && (
                  <Button variant="outline" className="justify-start border-primary text-primary" asChild>
                    <Link href="/dashboard">
                      <BarChartIcon className="mr-2 h-4 w-4" />
                      Painel Administrativo
                    </Link>
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="justify-start"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </nav>
            </aside>

            <section className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Seus dados pessoais e informações de contato.</CardDescription>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Nome</dt>
                      <dd>{user.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                      <dd>{user.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Membro desde</dt>
                      <dd>{user.createdAt ? new Date(user.createdAt as any).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }) : "Data não disponível"}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/perfil/editar">Editar Informações</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Seus upload e analises recentes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Últimos Uploads</h3>
                      <div className="text-center py-4 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground text-sm">Você ainda não realizou nenhum upload.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Últimas Analises</h3>
                      <div className="text-center py-4 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground text-sm">Você ainda não realizou nenhum upload.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/uploads">Ver Todos os Uploads</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/perfil/avaliacoes">Ver Todas as Analises</Link>
                  </Button>
                </CardFooter>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
