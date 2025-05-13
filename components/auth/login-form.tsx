"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Credenciais mock para demo
      const mockUsers = [
        { email: "admin@example.com", password: "password123", name: "Admin", role: "admin" },
        { email: "researcher@example.com", password: "password123", name: "Researcher", role: "researcher" },
        { email: "farmer@example.com", password: "password123", name: "Farmer", role: "farmer" },
      ]

      const mockUser = mockUsers.find(
        (u) => u.email === values.email && u.password === values.password
      )

      if (mockUser) {
        // Simula autenticação local (exemplo: salva no localStorage)
        localStorage.setItem(
          "user",
          JSON.stringify({ name: mockUser.name, email: mockUser.email, role: mockUser.role })
        )
        toast({
          title: "Login bem-sucedido",
          description: "Você entrou com sucesso usando credenciais demo.",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 300)
        setIsLoading(false)
        return
      }

      // Login real (backend)
      await login(values.email, values.password)
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
      setTimeout(() => {
        router.push("/dashboard")
      }, 300)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Alert className="mb-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Demo Credentials</AlertTitle>
        <AlertDescription>
          <p className="mt-1">You can use these demo accounts:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            <li>Admin: admin@example.com / password123</li>
            <li>Researcher: researcher@example.com / password123</li>
            <li>Farmer: farmer@example.com / password123</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
