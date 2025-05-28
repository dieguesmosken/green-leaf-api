"use client"

import { useAuth } from "@/context/firebase-auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DebugAuth() {
  const { user, firebaseUser, isLoading, isAuthenticated } = useAuth()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug de Autenticação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Estado de Loading:</strong>
          <Badge variant={isLoading ? "secondary" : "default"}>
            {isLoading ? "Carregando..." : "Carregado"}
          </Badge>
        </div>
        
        <div>
          <strong>isAuthenticated:</strong>
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {isAuthenticated ? "Autenticado" : "Não Autenticado"}
          </Badge>
        </div>

        <div>
          <strong>Firebase User:</strong>
          {firebaseUser ? (
            <div className="mt-2 space-y-2">
              <p><strong>UID:</strong> {firebaseUser.uid}</p>
              <p><strong>Email:</strong> {firebaseUser.email}</p>
              <p><strong>Email Verificado:</strong> {firebaseUser.emailVerified ? "Sim" : "Não"}</p>
              <p><strong>Display Name:</strong> {firebaseUser.displayName || "N/A"}</p>
            </div>
          ) : (
            <Badge variant="destructive">Nenhum Firebase User</Badge>
          )}
        </div>

        <div>
          <strong>User Profile (Firestore):</strong>
          {user ? (
            <div className="mt-2 space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Nome:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Admin:</strong> {user.isAdmin ? "Sim" : "Não"}</p>
            </div>
          ) : (
            <Badge variant="destructive">Nenhum User Profile no Firestore</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
