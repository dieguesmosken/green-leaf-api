"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { FirebaseAuthProvider } from "@/context/firebase-auth-context"

// Flag para escolher qual sistema de auth usar
const USE_FIREBASE_AUTH = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      }),
  )

  // Escolher o provider de autenticação
  const AuthContextProvider = USE_FIREBASE_AUTH ? FirebaseAuthProvider : AuthProvider

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </AuthContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
