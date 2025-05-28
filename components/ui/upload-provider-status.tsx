"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { uploader } from "@/lib/multi-upload"

interface ProviderStatus {
  provider: string
  available: boolean
}

export function UploadProviderStatus() {
  const [providers, setProviders] = useState<ProviderStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const checkProviders = async () => {
    setIsLoading(true)
    try {
      const status = await uploader.getProviderStatus()
      setProviders(status)
      setLastCheck(new Date())
    } catch (error) {
      console.error("Erro ao verificar status dos provedores:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkProviders()
  }, [])

  const getStatusIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }
  const getStatusBadge = (available: boolean) => {
    return (
      <Badge variant={available ? "default" : "destructive"} className={available ? "bg-green-100 text-green-800 border-green-200" : ""}>
        {available ? "Disponível" : "Indisponível"}
      </Badge>
    )
  }

  const getOverallStatus = () => {
    if (providers.length === 0) return { icon: <AlertCircle className="h-4 w-4 text-yellow-500" />, text: "Verificando..." }
    
    const availableCount = providers.filter(p => p.available).length
    
    if (availableCount === 0) {
      return { icon: <XCircle className="h-4 w-4 text-red-500" />, text: "Todos indisponíveis" }
    } else if (availableCount < providers.length) {
      return { icon: <AlertCircle className="h-4 w-4 text-yellow-500" />, text: "Parcialmente disponível" }
    } else {
      return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "Todos disponíveis" }
    }
  }

  const overallStatus = getOverallStatus()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {overallStatus.icon}
            Status dos Uploads
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={checkProviders}
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
        <p className="text-sm text-muted-foreground">
          {overallStatus.text}
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.provider} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(provider.available)}
              <span className="text-sm font-medium">{provider.provider}</span>
            </div>
            {getStatusBadge(provider.available)}
          </div>
        ))}
        
        {providers.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Nenhum provedor configurado
          </p>
        )}

        {lastCheck && (
          <p className="text-xs text-muted-foreground text-center border-t pt-2">
            Última verificação: {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
