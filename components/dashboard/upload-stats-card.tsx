"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileUp, TrendingUp, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react"
import { useUploadContext } from "@/context/upload-context"

export function UploadStatsCard() {
  const { uploads, getStats, clearUploads } = useUploadContext()
  const stats = getStats()
  
  // Pegar apenas os 5 uploads mais recentes para exibir
  const recentUploads = uploads.slice(0, 5)

  const successRate = stats.total > 0 ? stats.successRate : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failed: "destructive", 
      pending: "secondary"
    } as const

    const labels = {
      success: "Sucesso",
      failed: "Falhou",
      pending: "Pendente"
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="text-xs">
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const formatFileSize = (sizeInMB: number) => {
    return `${sizeInMB.toFixed(1)} MB`
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Agora mesmo"
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d atrás`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Estatísticas de Upload
        </CardTitle>
        <CardDescription>
          Resumo dos uploads de imagens recentes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas Gerais */}        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total de Uploads</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{successRate}%</p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>

        {/* Distribuição */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Sucessos:</span>
            <span className="text-sm font-medium text-green-600">{stats.successful}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Falhas:</span>
            <span className="text-sm font-medium text-red-600">{stats.failed}</span>
          </div>
        </div>        {/* Uploads Recentes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Uploads Recentes</h4>
            {uploads.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearUploads}
                className="h-8 text-xs"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {recentUploads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum upload realizado ainda
              </p>
            ) : (
              recentUploads.map((upload) => (
                <div 
                  key={upload.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getStatusIcon(upload.status)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{upload.fileName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{upload.provider}</span>
                        <span>•</span>
                        <span>{formatFileSize(upload.size)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(upload.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(upload.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
