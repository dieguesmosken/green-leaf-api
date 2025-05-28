"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"

export function AccountManager() {
  const { user, deleteAccount } = useAuth()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError("Digite sua senha para confirmar")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      await deleteAccount(deletePassword)
      
      // Usuário será redirecionado automaticamente pelo contexto
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetDeleteDialog = () => {
    setDeletePassword("")
    setShowPassword(false)
    setError("")
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis para sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Estas ações são permanentes e não podem ser desfeitas.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Deletar Conta</h4>
            <p className="text-sm text-gray-600 mb-3">
              Remove permanentemente sua conta e todos os dados associados.
            </p>
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar Conta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Deletar Conta</DialogTitle>
                  <DialogDescription>
                    Esta ação não pode ser desfeita. Todos os seus dados serão removidos permanentemente.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Todos os seguintes dados serão deletados:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Perfil do usuário</li>
                        <li>Análises de plantas</li>
                        <li>Histórico de uploads</li>
                        <li>Configurações da conta</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">
                      Digite sua senha para confirmar
                    </Label>
                    <div className="relative">
                      <Input
                        id="deletePassword"
                        type={showPassword ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Sua senha atual"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Para confirmar, digite:</p>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {user?.email}
                    </code>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={resetDeleteDialog}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isLoading || !deletePassword}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                        Deletando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar Permanentemente
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
