"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailVerification } from "@/components/auth/email-verification"
import { useAuth } from "@/context/firebase-auth-context"
import { CheckCircle, Mail, User, Shield } from "lucide-react"

export default function WelcomePage() {
  const { user, firebaseUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const steps = [
    {
      icon: Mail,
      title: "Verificar Email",
      description: "Confirme seu endereço de email para acessar todos os recursos",
      completed: firebaseUser?.emailVerified || false
    },
    {
      icon: User,
      title: "Completar Perfil",
      description: "Adicione sua foto e informações pessoais",
      completed: !!user.image
    },
    {
      icon: Shield,
      title: "Configurar Segurança",
      description: "Configure uma senha forte e medidas de segurança",
      completed: true // Assume que já tem senha por ter se registrado
    }
  ]

  const completedSteps = steps.filter(step => step.completed).length

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Bem-vindo ao Green Leaf! 🌱
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Olá <strong>{user.name}</strong>, ficamos felizes em tê-lo conosco!
            </p>
            <div className="bg-white p-4 rounded-lg shadow-sm border inline-block">
              <p className="text-sm text-muted-foreground">
                Progresso da configuração: <strong>{completedSteps}/{steps.length}</strong>
              </p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {steps.map((step, index) => (
              <Card key={index} className={`relative ${step.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <step.icon className={`h-5 w-5 ${step.completed ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    {step.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            {!firebaseUser?.emailVerified && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-amber-800">Primeiro Passo: Verificar Email</CardTitle>
                  <CardDescription className="text-amber-700">
                    Para garantir a segurança da sua conta, você precisa verificar seu email antes de continuar.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailVerification />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>
                  Complete sua configuração para aproveitar ao máximo o Green Leaf
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    asChild 
                    variant={firebaseUser?.emailVerified ? "default" : "secondary"}
                    disabled={!firebaseUser?.emailVerified}
                    className="h-auto py-4 px-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <User className="h-6 w-6 mb-2" />
                      <span className="font-medium">Completar Perfil</span>
                      <span className="text-xs opacity-70">Adicione sua foto e informações</span>
                    </div>
                  </Button>

                  <Button 
                    asChild 
                    variant="outline"
                    className="h-auto py-4 px-6"
                  >
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-6 w-6 mb-2" />
                      <span className="font-medium">Configurar Segurança</span>
                      <span className="text-xs opacity-70">Gerencie senha e privacidade</span>
                    </div>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full"
                    disabled={!firebaseUser?.emailVerified}
                  >
                    <a href="/dashboard">
                      Ir para o Dashboard
                    </a>
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {firebaseUser?.emailVerified 
                      ? "Comece a usar o Green Leaf agora!" 
                      : "Verifique seu email primeiro para acessar o dashboard"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Dicas para Começar</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Faça upload de imagens de plantas para análise automática</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Visualize mapas de calor das condições das plantas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Acompanhe o histórico de saúde das suas plantas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Receba recomendações personalizadas de cuidados</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
