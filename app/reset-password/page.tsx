"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Leaf } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
// Importe o novo componente de rodapé
import { Footer } from "@/components/footer"

// Atualize os textos
export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()
        setIsValidToken(data.success && data.valid)
      } catch (error) {
        console.error("Error verifying token:", error)
        setIsValidToken(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Green Leaf</span>
        </Link>
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Redefinir senha</h1>
            <p className="mt-2 text-sm text-muted-foreground">Crie uma nova senha para sua conta</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : isValidToken ? (
            <ResetPasswordForm token={token!} />
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Link inválido ou expirado</AlertTitle>
              <AlertDescription>
                <p>O link de redefinição de senha é inválido ou expirou.</p>
                <p className="mt-2">
                  <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                    Solicitar um novo link
                  </Link>
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm">
            <p>
              Lembrou sua senha?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Voltar para o login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
