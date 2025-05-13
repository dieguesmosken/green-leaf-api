import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Green Leaf</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">Início</Button>
            </Link>
            <Link href="/equipe">
              <Button variant="ghost">Equipe</Button>
            </Link>
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
        <div className="container py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Sobre o Green Leaf</h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                Capacitando agricultores e pesquisadores no combate a infecções bacterianas em plantas de mandioca
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Nossa Missão</h2>
              <p className="text-gray-500 dark:text-gray-400">
                O Green Leaf é dedicado a melhorar a segurança alimentar fornecendo ferramentas avançadas para a
                detecção precoce e gerenciamento de infecções por Xanthomonas phaseoli em cultivos de mandioca. Nossa
                plataforma com tecnologia de IA ajuda agricultores e pesquisadores a identificar, rastrear e responder a
                infecções bacterianas, reduzindo perdas de colheitas e melhorando a produtividade.
              </p>

              <h2 className="text-2xl font-bold">O Problema</h2>
              <p className="text-gray-500 dark:text-gray-400">
                A mandioca é um alimento básico para mais de 800 milhões de pessoas em todo o mundo, particularmente em
                regiões em desenvolvimento. Infecções bacterianas causadas por Xanthomonas phaseoli podem devastar
                cultivos de mandioca, levando a significativas escassezes de alimentos e perdas econômicas. A detecção
                precoce e o gerenciamento dessas infecções são cruciais, mas frequentemente desafiadores devido a
                recursos e expertise limitados.
              </p>

              <h2 className="text-2xl font-bold">Nossa Solução</h2>
              <p className="text-gray-500 dark:text-gray-400">
                O Green Leaf combina tecnologia de aprendizado profundo com mapeamento geoespacial para fornecer uma
                solução abrangente para o gerenciamento de infecções bacterianas. Nossa plataforma permite aos usuários:
              </p>
              <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400 space-y-2">
                <li>Carregar e analisar imagens de folhas de mandioca para detecção de infecções</li>
                <li>Visualizar a distribuição de infecções através de mapas de calor interativos</li>
                <li>Rastrear padrões de infecção ao longo do tempo e em diferentes regiões</li>
                <li>Receber alertas precoces e recomendações para o gerenciamento de infecções</li>
                <li>Colaborar com pesquisadores e outros agricultores para compartilhar conhecimento e recursos</li>
              </ul>

              <h2 className="text-2xl font-bold">Nossa Equipe</h2>
              <p className="text-gray-500 dark:text-gray-400">
                O Green Leaf foi fundado por uma equipe de cientistas agrícolas, especialistas em IA e engenheiros de
                software comprometidos em aplicar tecnologia para resolver desafios críticos de segurança alimentar.
                Nossa equipe diversificada reúne expertise em patologia vegetal, aprendizado de máquina e design
                centrado no usuário para criar uma plataforma que é ao mesmo tempo poderosa e acessível.
              </p>

              <div className="flex justify-center pt-4">
                <Link href="/equipe">
                  <Button size="lg">Conheça Nossa Equipe</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
