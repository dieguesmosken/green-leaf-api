"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, CheckCircle2 } from "lucide-react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido" }),
})

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Use Firebase Auth directly to send password reset email
      await sendPasswordResetEmail(auth, values.email, {
        url: `${window.location.origin}/login`, // Redirect to login after reset
      })

      setIsSubmitted(true)
      toast({
        title: "Email enviado",
        description: "Se seu email estiver registrado, você receberá um link para redefinir sua senha.",
      })
    } catch (error: any) {
      console.error("Password reset error:", error)
      
      let errorMessage = "Ocorreu um erro ao processar sua solicitação"
      
      // Handle Firebase Auth specific errors
      if (error.code === 'auth/user-not-found') {
        // Don't reveal if user exists for security
        setIsSubmitted(true)
        toast({
          title: "Email enviado",
          description: "Se seu email estiver registrado, você receberá um link para redefinir sua senha.",
        })
        return
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido"
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas. Tente novamente mais tarde."
      }
      
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Email enviado</AlertTitle>
        <AlertDescription className="text-green-700">
          Se o email fornecido estiver associado a uma conta, você receberá um link para redefinir sua senha.
          <p className="mt-2">Verifique sua caixa de entrada e pasta de spam.</p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Informação</AlertTitle>
        <AlertDescription>
          Insira o email associado à sua conta para receber um link de redefinição de senha.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Seu email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar link de redefinição"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
