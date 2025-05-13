import { RegisterForm } from "@/components/auth/register-form"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Green Leaf</span>
        </Link>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Criar uma conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Cadastre-se para começar a usar o Green Leaf</p>
          </div>
          <RegisterForm />
          <div className="text-center text-sm">
            <p>
              Já tem uma conta?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
