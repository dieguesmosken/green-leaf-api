"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Mail, RefreshCw } from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"

export function EmailVerification() {
  const { user, firebaseUser, sendEmailVerification, checkEmailVerification } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showResendButton, setShowResendButton] = useState(true)

  useEffect(() => {
    setIsVerified(firebaseUser?.emailVerified || false)
  }, [firebaseUser?.emailVerified])

  const handleSendVerification = async () => {
    try {
      setIsLoading(true)
      await sendEmailVerification()
      setShowResendButton(false)
      
      // Reativar botão após 60 segundos
      setTimeout(() => {
        setShowResendButton(true)
      }, 60000)
    } catch (error) {
      console.error("Erro ao enviar verificação:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckVerification = async () => {
    try {
      setIsLoading(true)
      const verified = await checkEmailVerification()
      setIsVerified(verified)
      
      if (verified) {
        window.location.reload() // Recarrega para atualizar o estado
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Seu email foi verificado com sucesso!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verificar Email</CardTitle>
        <CardDescription>
          Enviamos um link de verificação para <strong>{user?.email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Verifique sua caixa de entrada e clique no link para verificar seu email.
            Não esqueça de verificar a pasta de spam.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleCheckVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Verificar Status
          </Button>

          <Button
            variant="outline"
            onClick={handleSendVerification}
            disabled={isLoading || !showResendButton}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            {showResendButton ? "Reenviar Email" : "Email Enviado (aguarde 1 min)"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
