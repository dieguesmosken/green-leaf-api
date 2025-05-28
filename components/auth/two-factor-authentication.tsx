"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Smartphone, Key, CheckCircle, XCircle, Eye, EyeOff, Copy } from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"
import { toast } from "sonner"

interface TwoFactorProps {
  user: any
}

export function TwoFactorAuthentication() {
  const { user, updateUser } = useAuth()
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'setup' | 'verify' | 'manage'>('setup')
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)

  useEffect(() => {
    if (user?.twoFactorEnabled) {
      setIsEnabled(true)
      setStep('manage')
    }
  }, [user])

  const generateSecret = async () => {
    try {
      setIsLoading(true)
      
      // Simulação da geração de secret e QR code
      // Em produção, isso seria feito no backend
      const mockSecret = Array.from({ length: 32 }, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
      ).join('')
      
      const qrCodeUrl = `otpauth://totp/Green%20Leaf:${user?.email}?secret=${mockSecret}&issuer=Green%20Leaf`
      
      setSecret(mockSecret)
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`)
      setStep('verify')
      
      toast.success("Código 2FA gerado com sucesso!")
    } catch (error) {
      toast.error("Erro ao gerar código 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyAndEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Insira um código de 6 dígitos")
      return
    }

    try {
      setIsLoading(true)
      
      // Simulação da verificação do código
      // Em produção, isso seria verificado no backend
      const isValidCode = verificationCode === "123456" // Mock para demonstração
      
      if (isValidCode) {
        // Gerar códigos de backup
        const codes = Array.from({ length: 10 }, () => 
          Math.random().toString(36).substr(2, 8).toUpperCase()
        )
        setBackupCodes(codes)
        
        // Atualizar perfil do usuário
        await updateUser({ twoFactorEnabled: true })
        
        setIsEnabled(true)
        setStep('manage')
        setShowBackupCodes(true)
        
        toast.success("2FA ativado com sucesso!")
      } else {
        toast.error("Código inválido. Tente novamente.")
      }
    } catch (error) {
      toast.error("Erro ao verificar código")
    } finally {
      setIsLoading(false)
    }
  }

  const disable2FA = async () => {
    try {
      setIsLoading(true)
      
      await updateUser({ twoFactorEnabled: false })
      
      setIsEnabled(false)
      setStep('setup')
      setSecret("")
      setQrCode("")
      setBackupCodes([])
      
      toast.success("2FA desativado com sucesso!")
    } catch (error) {
      toast.error("Erro ao desativar 2FA")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado para a área de transferência!")
  }

  const copyAllBackupCodes = () => {
    const allCodes = backupCodes.join('\n')
    navigator.clipboard.writeText(allCodes)
    toast.success("Todos os códigos copiados!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Autenticação de Dois Fatores (2FA)
          {isEnabled && (
            <Badge variant="secondary" className="ml-2">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ativo
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Adicione uma camada extra de segurança à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup" disabled={isEnabled}>Configurar</TabsTrigger>
            <TabsTrigger value="verify" disabled={isEnabled || !secret}>Verificar</TabsTrigger>
            <TabsTrigger value="manage" disabled={!isEnabled}>Gerenciar</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Configure a Autenticação 2FA</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Use um aplicativo como Google Authenticator, Authy ou Microsoft Authenticator
                  para gerar códigos de segurança.
                </p>
              </div>
              <Button 
                onClick={generateSecret} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Gerando..." : "Começar Configuração"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Escaneie o QR Code</h3>
                {qrCode && (
                  <div className="flex justify-center mb-4">
                    <img src={qrCode} alt="QR Code para 2FA" className="border rounded" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret">Ou insira manualmente o código secreto:</Label>
                <div className="flex gap-2">
                  <Input
                    id="secret"
                    value={secret}
                    type={showSecret ? "text" : "password"}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(secret)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification">Código de Verificação (6 dígitos):</Label>
                <Input
                  id="verification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador para confirmar a configuração.
                </AlertDescription>
              </Alert>

              <Button
                onClick={verifyAndEnable2FA}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full"
              >
                {isLoading ? "Verificando..." : "Verificar e Ativar 2FA"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">2FA Ativo</p>
                    <p className="text-sm text-gray-600">Sua conta está protegida</p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={disable2FA}
                  disabled={isLoading}
                >
                  {isLoading ? "Desativando..." : "Desativar 2FA"}
                </Button>
              </div>

              {showBackupCodes && backupCodes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Códigos de Backup</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllBackupCodes}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Todos
                    </Button>
                  </div>
                  <Alert>
                    <AlertDescription>
                      <strong>Importante:</strong> Guarde estes códigos em local seguro. 
                      Cada código pode ser usado apenas uma vez se você perder acesso ao seu app autenticador.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="p-2 bg-gray-50 border rounded flex items-center justify-between cursor-pointer hover:bg-gray-100"
                        onClick={() => copyToClipboard(code)}
                      >
                        <span>{code}</span>
                        <Copy className="h-3 w-3 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Instruções:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mantenha seu app autenticador sempre atualizado</li>
                  <li>• Guarde os códigos de backup em local seguro</li>
                  <li>• Use 2FA apenas em dispositivos confiáveis</li>
                  <li>• Entre em contato com suporte se perder acesso</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
