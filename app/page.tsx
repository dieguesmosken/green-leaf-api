import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Leaf, MapPin, Shield } from "lucide-react"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Green Leaf</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Cadastrar</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Detecte e Mapeie Infecções Bacterianas em Folhas de Mandioca
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Green Leaf usa IA para detectar infecções por Xanthomonas phaseoli em folhas de mandioca, ajudando
                    agricultores e pesquisadores a proteger as plantações e garantir a segurança alimentar.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1">
                      Começar Agora
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Saiba Mais
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <img
                  alt="Análise de folha de mandioca"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  height="550"
                  src="/placeholder.svg?height=550&width=800"
                  width="800"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Principais Recursos</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Nossa plataforma oferece ferramentas poderosas para detectar, analisar e mapear infecções bacterianas
                  em plantas de mandioca.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <Shield className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Detecção com IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Faça upload de imagens de folhas de mandioca e obtenha análise instantânea da probabilidade de
                    infecção bacteriana usando aprendizado profundo.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <MapPin className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Mapeamento Geoespacial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Visualize a distribuição de infecções com mapas de calor interativos para identificar áreas
                    vulneráveis e rastrear padrões de propagação.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Leaf className="h-12 w-12 text-primary mb-2" />
                  <CardTitle>Insights Baseados em Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Acesse análises detalhadas e relatórios para tomar decisões informadas sobre o manejo de culturas e
                    prevenção de doenças.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
