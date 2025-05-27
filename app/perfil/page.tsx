"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ShoppingBag, Star, User, Settings, LogOut, BarChartIcon } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/perfil")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-background">
        <div className="container max-w-5xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">Meu Perfil</h1>
              <p className="text-muted-foreground mt-2">Gerencie suas informações pessoais e acompanhe seus pedidos.</p>
            </div>
            <Button asChild variant="default" className="h-10 px-6">
              <Link href="/perfil/editar">Editar Perfil</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
            <aside className="space-y-6">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
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
