import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
              <Button variant="ghost">Inicio</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Termos de Serviço</h1>
              <p className="text-gray-500 md:text-xl dark:text-gray-400">Ultima Atualização: 13 de Maio de 2025</p>
            </div>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">1. Introdução</h2>
              <p className="text-gray-500 dark:text-gray-400">
              Bem-vindo ao Green Leaf. Estes Termos de Serviço regem o uso do nosso site e serviços. Ao acessar ou usar o Green Leaf, você concorda em estar vinculado a estes Termos.
              </p>

              <h2 className="text-2xl font-bold">2. Definiçoes</h2>
              <p className="text-gray-500 dark:text-gray-400">
              "Serviço" refere-se à plataforma Green Leaf, incluindo todas as funcionalidades, características e interfaces de usuário. "Usuário" refere-se a qualquer indivíduo que acessa ou utiliza o Serviço. "Conteúdo" refere-se a todas as informações, dados, textos, imagens e outros materiais carregados, baixados ou que aparecem no Serviço.
              </p>

              <h2 className="text-2xl font-bold">3. Registro de Conta</h2>
              <p className="text-gray-500 dark:text-gray-400">
              Para usar certos recursos do Serviço, pode ser necessário registrar-se para uma conta. Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e a atualizar essas informações para mantê-las precisas, atuais e completas.
              </p>

              <h2 className="text-2xl font-bold">4. User Responsibilities</h2>
              <p className="text-gray-500 dark:text-gray-400">
                You are responsible for all activities that occur under your account. You agree not to use the Service
                for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in
                your jurisdiction.
              </p>

              <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
              <p className="text-gray-500 dark:text-gray-400">
                The Service and its original content, features, and functionality are owned by Green Leaf and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                or proprietary rights laws.
              </p>

              <h2 className="text-2xl font-bold">6. Privacy Policy</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into
                these Terms of Service.
              </p>

              <h2 className="text-2xl font-bold">7. Termination</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                not limited to a breach of the Terms.
              </p>

              <h2 className="text-2xl font-bold">8. Limitation of Liability</h2>
              <p className="text-gray-500 dark:text-gray-400">
                In no event shall Green Leaf, nor its directors, employees, partners, agents, suppliers, or affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-2xl font-bold">9. Changes to Terms</h2>
              <p className="text-gray-500 dark:text-gray-400">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-2xl font-bold">10. Contact Us</h2>
              <p className="text-gray-500 dark:text-gray-400">
                If you have any questions about these Terms, please contact us at support@greenleaf.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2023 Green Leaf. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
