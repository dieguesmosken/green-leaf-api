import { LoginForm } from "@/components/auth/login-form"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function LoginPage() {
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
              <h1 className="text-2xl font-bold tracking-tight">Bem-vindo de volta</h1>
              <p className="mt-2 text-sm text-muted-foreground">Entre na sua conta para continuar</p>
            </div>
            <LoginForm />
            <div className="text-center text-sm">
              <p>
                Não tem uma conta?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  )
}
