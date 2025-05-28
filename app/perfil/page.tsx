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
import { TwoFactorAuthentication } from "@/components/auth/two-factor-authentication"
import { SessionManager } from "@/components/auth/session-manager"
import { AuditLogger } from "@/components/auth/audit-logger"
import { RateLimitManager } from "@/components/auth/rate-limit-manager"
import { ShoppingBag, Star, User, Settings, LogOut, BarChartIcon, Shield, Mail, Camera, Smartphone, Monitor, FileText, Zap } from "lucide-react"

export default function ProfilePage() {
  const { user, firebaseUser, logout, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Aguardar o carregamento antes de redirecionar
    if (!isLoading && !user) {
      router.push("/login?redirect=/perfil")
    }
  }, [user, router, isLoading])

  const getUserInitials = () => {
    return user?.name?.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  // Mostrar loading se ainda estiver carregando
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 bg-background">
          <div className="container max-w-6xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Carregando perfil...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Retornar null se não houver usuário (redirecionamento será feito pelo useEffect)
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
                      <div className="flex gap-2 mt-3 flex-wrap">
                      <Badge variant={firebaseUser?.emailVerified ? "default" : "secondary"}>
                        {firebaseUser?.emailVerified ? "Email Verificado" : "Email Pendente"}
                      </Badge>
                      <Badge variant={user.twoFactorEnabled ? "default" : "outline"}>
                        {user.twoFactorEnabled ? "2FA Ativo" : "2FA Desativado"}
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
                    </Button>                    <Button
                      variant={activeTab === "verification" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("verification")}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Verificação
                    </Button>
                    <Button
                      variant={activeTab === "2fa" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("2fa")}
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      Autenticação 2FA
                    </Button>                    <Button
                      variant={activeTab === "sessions" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("sessions")}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Sessões Ativas
                    </Button>
                    <Button
                      variant={activeTab === "audit" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("audit")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Log de Auditoria
                    </Button>
                    <Button
                      variant={activeTab === "rate-limiting" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("rate-limiting")}
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Rate Limiting
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
                        </div>                        <div>
                          <label className="text-sm font-medium">Status do Email</label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {firebaseUser?.emailVerified ? "Verificado" : "Pendente de verificação"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Autenticação 2FA</label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {user.twoFactorEnabled ? "Ativado" : "Desativado"}
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
                </TabsContent>                <TabsContent value="verification">
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

                <TabsContent value="2fa">
                  <TwoFactorAuthentication />
                </TabsContent>                <TabsContent value="sessions">
                  <SessionManager />
                </TabsContent>

                <TabsContent value="audit">
                  <AuditLogger />
                </TabsContent>

                <TabsContent value="rate-limiting">
                  <RateLimitManager />
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
                      <CardContent className="space-y-4">                        <Button onClick={logout} variant="outline" className="w-full">
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
    </div>  )
}
