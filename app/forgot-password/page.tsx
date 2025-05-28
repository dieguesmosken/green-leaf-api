import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

// Atualize os textos
export default function ForgotPasswordPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Green Leaf</span>
          </Link>
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Esqueceu sua senha?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Insira seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>
            <ForgotPasswordForm />
            <div className="text-center text-sm">
              <p>
                Lembrou sua senha?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Voltar para o login
                </Link>            </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  )
}
