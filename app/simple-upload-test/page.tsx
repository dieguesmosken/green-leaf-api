"use client"

import { useState } from "react"
import { useAuth } from "@/context/firebase-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage, auth } from "@/lib/firebase"
import { uploadAvatarAlternative } from "@/lib/upload-alternative"

export default function SimpleUploadTest() {
  const { user, firebaseUser } = useAuth()
  const [result, setResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testDirectUpload = async () => {
    setIsLoading(true)
    setResult("")
    
    try {
      console.log("🧪 Teste direto de upload...")
      
      if (!firebaseUser) {
        throw new Error("Usuário não encontrado no contexto")
      }
      
      console.log("👤 Firebase User:", firebaseUser.email)
      console.log("🆔 UID:", firebaseUser.uid)
      
      // Verificar auth.currentUser
      console.log("🔍 auth.currentUser:", auth.currentUser ? auth.currentUser.email : "null")
      
      if (!auth.currentUser) {
        setResult("❌ auth.currentUser é null, mas contexto tem usuário!")
        return
      }
      
      // Forçar refresh do token
      console.log("🔄 Forçando refresh do token...")
      await auth.currentUser.reload()
      const token = await auth.currentUser.getIdToken(true)
      console.log("🔑 Token obtido:", token ? "✅" : "❌")
      
      // Criar arquivo de teste
      const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
      const testFile = new File([testData], "test.png", { type: "image/png" })
      
      // Tentar upload direto
      console.log("📤 Tentando upload direto...")
      const storageRef = ref(storage, `avatars/${firebaseUser.uid}/test_${Date.now()}.png`)
      
      const snapshot = await uploadBytes(storageRef, testFile)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      setResult(`✅ Upload funcionou! URL: ${downloadURL}`)
      
    } catch (error: any) {
      console.error("❌ Erro:", error)
      setResult(`❌ Erro: ${error.code || error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testAlternativeUpload = async () => {
    setIsLoading(true)
    setResult("")
    
    try {
      console.log("🚀 Teste de upload alternativo...")
      
      if (!firebaseUser) {
        throw new Error("Usuário não encontrado no contexto")
      }
      
      // Criar arquivo de teste
      const testData = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
      const testFile = new File([testData], "test-alternative.png", { type: "image/png" })
      
      // Usar função alternativa
      const downloadURL = await uploadAvatarAlternative(firebaseUser.uid, testFile)
      
      setResult(`✅ Upload alternativo funcionou! URL: ${downloadURL}`)
      
    } catch (error: any) {
      console.error("❌ Erro:", error)
      setResult(`❌ Erro alternativo: ${error.code || error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Teste Simples de Upload</CardTitle>
            <CardDescription>Faça login para continuar</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste Simples de Upload</CardTitle>
          <CardDescription>Teste direto do Firebase Storage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>Usuário:</strong> {user.email}</p>
            <p><strong>UID:</strong> {firebaseUser?.uid}</p>
          </div>          <Button 
            onClick={testDirectUpload} 
            disabled={isLoading}
            className="w-full mb-2"
          >
            {isLoading ? "Testando..." : "Teste Direto de Upload"}
          </Button>

          <Button 
            onClick={testAlternativeUpload} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Testando..." : "Teste Upload Alternativo"}
          </Button>

          {result && (
            <Alert variant={result.includes("✅") ? "default" : "destructive"}>
              <AlertDescription className="whitespace-pre-wrap">
                {result}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
