"use client"

import { useState } from "react"
import { useAuth } from "@/context/firebase-auth-context"
import { uploadUserAvatar, waitForAuth, debugAuthState, getCurrentAuthToken, debugFirebaseConfig, ensureAuthStorageSync } from "@/lib/firebase-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestAvatarUpload() {
  const { user, firebaseUser, isLoading: authLoading } = useAuth()
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const runAuthTest = async () => {
    setIsLoading(true)
    setTestResult("")
      try {
      console.log("🔍 Iniciando teste de autenticação...")
      
      // Debug configuração do Firebase
      debugFirebaseConfig()
      
      // Debug estado inicial
      debugAuthState()
      
      // Verificar contexto React
      console.log("👤 Usuário do contexto:", user ? user.email : "null")
      console.log("🔥 Firebase User:", firebaseUser ? firebaseUser.email : "null")
      console.log("⏳ Auth Loading:", authLoading)
      
      // Verificar token
      const token = await getCurrentAuthToken()
      console.log("🔑 Token:", token ? "Presente" : "Ausente")
      
      // Aguardar autenticação
      console.log("⏳ Aguardando estado de autenticação...")
      const currentUser = await waitForAuth()
      
      console.log("✅ Resultado waitForAuth:", currentUser ? currentUser.email : "null")
      
      if (!currentUser) {
        setTestResult("❌ Usuário não autenticado após waitForAuth")
        return
      }
      
      // Criar arquivo de teste
      const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]) // PNG header
      const testFile = new File([testData], "test-avatar.png", { type: "image/png" })
      
      console.log("📤 Tentando upload com arquivo:", testFile.name)
      
      // Tentar upload
      const downloadURL = await uploadUserAvatar(currentUser.uid, testFile)
      
      setTestResult(`✅ Upload realizado com sucesso! URL: ${downloadURL}`)
      
    } catch (error: any) {
      console.error("❌ Erro no teste:", error)
      setTestResult(`❌ Erro: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Upload de Avatar</CardTitle>
            <CardDescription>Aguardando autenticação...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Teste de Upload de Avatar</CardTitle>
            <CardDescription>Você precisa estar logado para usar este teste</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Por favor, faça login para continuar.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Upload de Avatar</CardTitle>
          <CardDescription>
            Teste para verificar se o upload de avatar está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>Usuário:</strong> {user.email}</p>
            <p><strong>UID:</strong> {firebaseUser?.uid}</p>
            <p><strong>Auth Loading:</strong> {authLoading ? "Sim" : "Não"}</p>
          </div>

          <Button 
            onClick={runAuthTest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testando..." : "Executar Teste de Upload"}
          </Button>

          {testResult && (
            <Alert variant={testResult.includes("✅") ? "default" : "destructive"}>
              <AlertDescription className="whitespace-pre-wrap">
                {testResult}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
