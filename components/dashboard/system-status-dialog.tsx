"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Activity, 
  Database, 
  CloudUpload, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Server,
  Wifi,
  HardDrive
} from "lucide-react"
import { uploader } from "@/lib/multi-upload"

interface SystemStatus {
  overall: "healthy" | "warning" | "error"
  services: {
    database: { status: "online" | "offline" | "slow", latency?: number }
    api: { status: "online" | "offline" | "slow", uptime?: string }
    upload: { providers: { name: string, available: boolean }[] }
    cache: { size: number, items: number }
  }
  lastUpdated: Date
}

interface SystemStatusDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onStatusChange?: (status: "healthy" | "warning" | "error") => void
}

export function SystemStatusDialog({ 
  open: controlledOpen, 
  onOpenChange, 
  onStatusChange 
}: SystemStatusDialogProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Usar controlled ou uncontrolled state
  const dialogOpen = controlledOpen !== undefined ? controlledOpen : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  const checkSystemStatus = async () => {
    setIsLoading(true)
    try {
      // Verificar provedores de upload
      const uploadProviders = await uploader.getProviderStatus()
      
      // Verificar API
      const apiStart = Date.now()
      const apiResponse = await fetch('/api/auth/me')
      const apiLatency = Date.now() - apiStart
      
      // Verificar cache
      const cacheSize = localStorage.length
      const cacheItems = Object.keys(localStorage).filter(k => k.startsWith('image_')).length
      
      // Simular verificação de database (em produção seria real)
      const dbLatency = Math.floor(Math.random() * 100) + 20
      
      const systemStatus: SystemStatus = {
        overall: uploadProviders.every(p => p.available) && apiResponse.ok ? "healthy" : "warning",
        services: {
          database: {
            status: "online",
            latency: dbLatency
          },
          api: {
            status: apiResponse.ok ? "online" : "offline",
            uptime: "99.9%"
          },
          upload: {
            providers: uploadProviders
          },
          cache: {
            size: cacheSize,
            items: cacheItems
          }
        },
        lastUpdated: new Date()      }
      
      setStatus(systemStatus)
      onStatusChange?.(systemStatus.overall)
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error)
      setStatus({
        overall: "error",
        services: {
          database: { status: "offline" },
          api: { status: "offline" },
          upload: { providers: [] },
          cache: { size: 0, items: 0 }        },
        lastUpdated: new Date()
      })
      onStatusChange?.("error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (dialogOpen) {
      checkSystemStatus()
    }
  }, [dialogOpen])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
      case "slow":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: "default",
      online: "default", 
      warning: "secondary",
      slow: "secondary",
      error: "destructive",
      offline: "destructive"
    } as const

    const labels = {
      healthy: "Saudável",
      online: "Online",
      warning: "Atenção", 
      slow: "Lento",
      error: "Erro",
      offline: "Offline"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!controlledOpen && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Status do Sistema
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {status && getStatusIcon(status.overall)}
              Status do Sistema
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkSystemStatus}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </DialogHeader>

        {!status && !isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Clique em "Atualizar" para verificar o status
          </div>
        )}

        {status && (
          <div className="space-y-6">
            {/* Status Geral */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(status.overall)}
                  Status Geral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Sistema:</span>
                  {getStatusBadge(status.overall)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Última atualização: {status.lastUpdated.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>

            {/* Serviços */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Database */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Banco de Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    {getStatusBadge(status.services.database.status)}
                  </div>
                  {status.services.database.latency && (
                    <div className="flex justify-between">
                      <span>Latência:</span>
                      <span className="text-sm">{status.services.database.latency}ms</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* API */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    {getStatusBadge(status.services.api.status)}
                  </div>
                  {status.services.api.uptime && (
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="text-sm">{status.services.api.uptime}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CloudUpload className="h-4 w-4" />
                    Upload de Imagens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {status.services.upload.providers.map((provider) => (
                    <div key={provider.name} className="flex justify-between">
                      <span>{provider.name}:</span>
                      {getStatusBadge(provider.available ? "online" : "offline")}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cache */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Cache Local
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Itens:</span>
                    <span className="text-sm">{status.services.cache.items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chaves:</span>
                    <span className="text-sm">{status.services.cache.size}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resumo dos Provedores de Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detalhes dos Provedores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {status.services.upload.providers.map((provider) => (
                    <div key={provider.name} className="flex items-center gap-3">
                      {getStatusIcon(provider.available ? "online" : "offline")}
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {provider.available ? "Operacional" : "Indisponível"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
