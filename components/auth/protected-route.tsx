"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebaseAuth } from "@/context/firebase-auth-context"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useFirebaseAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect será feito pelo useEffect
  }

  return <>{children}</>
}
