import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que precisam de autenticação
const protectedRoutes = ['/dashboard', '/profile', '/perfil']

// Rotas de autenticação  
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Para Firebase Auth, a verificação será feita no lado do cliente
  // O middleware apenas permite que as rotas sejam acessadas
  // A proteção real será feita pelos componentes ProtectedRoute e AuthGuard
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
