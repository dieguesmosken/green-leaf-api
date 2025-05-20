import { Button } from "@/components/ui/button"
import { Leaf, Github, Linkedin, Twitter, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EquipePage() {
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
            <Link href="/about">
              <Button variant="ghost">Sobre</Button>
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
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nossa Equipe</h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">
                Conheça os talentosos profissionais por trás do projeto Green Leaf
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {/* Leonardo de Lima */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src="https://avatars.githubusercontent.com/u/181168271"
                        alt="Foto do Leonardo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Leonardo de Lima</CardTitle>
                      <CardDescription className="text-lg">Analista de Dados</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <a
                          href="https://github.com/TheLimaLeo"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub de Leonardo"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/leonardo-lima556/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn de Leonardo"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://twitter.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter de Leonardo"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="sobre">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sobre">Sobre</TabsTrigger>
                      <TabsTrigger value="projetos">Projetos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sobre" className="pt-4">
                      <p className="text-muted-foreground">
                        Analista de dados, 26 anos, com experiência no uso de Python, Pandas, Matplotlib, Numpy, SQL e
                        Excel para coleta, tratamento e análise de dados. Atua na criação de dashboards, automação e
                        geração de insights estratégicos.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge>Python</Badge>
                        <Badge>Pandas</Badge>
                        <Badge>SQL</Badge>
                        <Badge>Data Visualization</Badge>
                        <Badge>Machine Learning</Badge>
                      </div>
                    </TabsContent>
                    <TabsContent value="projetos" className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Análise de Dados Agrícolas</AccordionTrigger>
                          <AccordionContent>
                            Desenvolvimento de um sistema de análise de dados para monitoramento de cultivos agrícolas,
                            utilizando Python e Pandas para processamento de grandes volumes de dados e Matplotlib para
                            visualização de tendências sazonais.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Dashboard de Sustentabilidade</AccordionTrigger>
                          <AccordionContent>
                            Criação de um dashboard interativo para monitoramento de métricas de sustentabilidade em
                            tempo real, utilizando Python, SQL e ferramentas de BI para visualização de dados.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Bruno De Lucca */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src="https://avatars.githubusercontent.com/u/186774654"
                        alt="Foto do Bruno"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Bruno De Lucca</CardTitle>
                      <CardDescription className="text-lg">Designer Gráfico</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <a
                          href="https://github.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub de Bruno"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://linkedin.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn de Bruno"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://twitter.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter de Bruno"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="sobre">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sobre">Sobre</TabsTrigger>
                      <TabsTrigger value="projetos">Projetos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sobre" className="pt-4">
                      <p className="text-muted-foreground">
                        Designer Gráfico, 22 anos, com experiência em design de interfaces e criação de identidades
                        visuais. Habilidades em Photoshop, Gimp e Figma. Focado em criar experiências visuais
                        impactantes e funcionais.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge>UI/UX</Badge>
                        <Badge>Figma</Badge>
                        <Badge>Photoshop</Badge>
                        <Badge>Gimp</Badge>
                        <Badge>Design System</Badge>
                      </div>
                    </TabsContent>
                    <TabsContent value="projetos" className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Redesign de Interface</AccordionTrigger>
                          <AccordionContent>
                            Redesign completo da interface de usuário de um aplicativo de monitoramento ambiental,
                            focando em melhorar a usabilidade e a experiência do usuário, utilizando Figma para
                            prototipagem e testes com usuários.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Identidade Visual Sustentável</AccordionTrigger>
                          <AccordionContent>
                            Desenvolvimento de identidade visual completa para uma startup de tecnologia verde,
                            incluindo logo, paleta de cores, tipografia e materiais de marketing digital.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Matheus Mosken */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src="https://avatars.githubusercontent.com/u/69434680"
                        alt="Foto do Matheus"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Matheus Mosken</CardTitle>
                      <CardDescription className="text-lg">Developer</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <a
                          href="https://github.com/dieguesmosken"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub de Matheus"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://linkedin.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn de Matheus"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://twitter.com/dieguesmosken"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter de Matheus"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="sobre">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sobre">Sobre</TabsTrigger>
                      <TabsTrigger value="projetos">Projetos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sobre" className="pt-4">
                      <p className="text-muted-foreground">
                        Developer, 22 anos, com experiência em desenvolvimento de software e aplicativos. Habilidades em
                        Linux, Python e React. Focado em criar soluções inovadoras e eficientes.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge>React</Badge>
                        <Badge>Python</Badge>
                        <Badge>Linux</Badge>
                        <Badge>Node.js</Badge>
                        <Badge>Next.js</Badge>
                      </div>
                    </TabsContent>
                    <TabsContent value="projetos" className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Loja Runa Verde</AccordionTrigger>
                          <AccordionContent>
                            A Runa Verde é uma plataforma web sustentável desenvolvida com Next.js 15, TypeScript e TailwindCSS, focada em conectar usuários conscientes por meio de uma experiência moderna, responsiva e segura. O sistema conta com autenticação via e-mail e Google OAuth 2.0 (em implementação), gerenciamento de sessões com NextAuth.js e banco de dados MongoDB, oferecendo uma base sólida para futuras expansões como sistemas de pagamento com checkout do Mercado Pago e integração com o ERP Bling via API v3. 🌱💻
                            <div className="mt-2">
                              <a href="https://runaverde.vercel.app/" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Aplicativo de Monitoramento</AccordionTrigger>
                          <AccordionContent>
                            Criação de um aplicativo web para monitoramento em tempo real de métricas ambientais,
                            utilizando React e WebSockets para atualizações em tempo real e visualização de dados.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Ana Flávia */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <Image
                        src="https://avatars.githubusercontent.com/u/199160244"
                        alt="Foto da Ana"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Ana Flávia</CardTitle>
                      <CardDescription className="text-lg">Administradora de Redes</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <a
                          href="https://github.com/Ana-129"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub de Ana"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/ana-flavia-guimar%C3%A3es-gon%C3%A7alves-718a3b307/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn de Ana"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </a>
                        <a
                          href="https://twitter.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter de Ana"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="sobre">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="sobre">Sobre</TabsTrigger>
                      <TabsTrigger value="projetos">Projetos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sobre" className="pt-4">
                      <p className="text-muted-foreground">
                        Administradora de redes, 19 anos, com experiência na segurança, infraestrutura, administração
                        das redes, configuração de servidores e monitoramento de servidores.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge>Segurança</Badge>
                        <Badge>Redes</Badge>
                        <Badge>Servidores</Badge>
                        <Badge>Cloud</Badge>
                        <Badge>Docker</Badge>
                      </div>
                    </TabsContent>
                    <TabsContent value="projetos" className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Infraestrutura em Nuvem</AccordionTrigger>
                          <AccordionContent>
                            Implementação de infraestrutura em nuvem para aplicações de monitoramento ambiental,
                            utilizando Docker e Kubernetes para orquestração de contêineres e garantindo alta
                            disponibilidade e escalabilidade.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Segurança de Dados Sensíveis</AccordionTrigger>
                          <AccordionContent>
                            Desenvolvimento e implementação de políticas de segurança para proteção de dados sensíveis
                            em sistemas de monitoramento ambiental, incluindo criptografia, autenticação multifator e
                            auditorias de segurança.
                            <div className="mt-2">
                              <a href="#" className="text-sm text-primary flex items-center gap-1">
                                Ver mais <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="pt-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Junte-se ao Nosso Time</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Estamos sempre em busca de talentos apaixonados por tecnologia e sustentabilidade. Se você está
                interessado em fazer parte da nossa missão, entre em contato conosco.
              </p>
              <Link href="/contact">
                <Button size="lg">Entre em Contato</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
