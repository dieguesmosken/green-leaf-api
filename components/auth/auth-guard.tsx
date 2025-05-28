"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthGuard({ 
  children, 
  fallback = <div>Carregando...</div>,
  redirectTo = "/login",
  requireAuth = true 
}: AuthGuardProps) {
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // For build purposes, skip authentication checks
    if (typeof window === 'undefined') {
      setShouldRender(true)
      setIsLoading(false)
      return
    }

    const checkAuth = () => {
      try {
        // Check localStorage for token (MongoDB auth)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        
        if (requireAuth && !token) {
          router.push(redirectTo)
          return
        }
        
        setShouldRender(true)
      } catch (error) {
        console.error('Auth check error:', error)
        setShouldRender(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requireAuth, redirectTo, router])

  if (isLoading) {
    return <>{fallback}</>
  }

  if (!shouldRender) {
    return null
  }

  return <>{children}</>
}
