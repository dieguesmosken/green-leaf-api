"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/firebase-auth-context"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  LogIn, 
  LogOut, 
  Settings, 
  Key,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  RefreshCw
} from "lucide-react"

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  action: string
  category: 'auth' | 'security' | 'profile' | 'session'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ipAddress: string
  userAgent: string
  location?: string
  details: Record<string, any>
  success: boolean
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    userId: 'current-user',
    action: 'LOGIN_SUCCESS',
    category: 'auth',
    severity: 'low',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'São Paulo, Brasil',
    details: { method: 'email_password' },
    success: true
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    userId: 'current-user',
    action: 'PROFILE_UPDATE',
    category: 'profile',
    severity: 'low',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'São Paulo, Brasil',
    details: { fields: ['name', 'image'] },
    success: true
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    userId: 'current-user',
    action: 'PASSWORD_CHANGE',
    category: 'security',
    severity: 'medium',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'São Paulo, Brasil',
    details: { strength: 'strong' },
    success: true
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    userId: 'current-user',
    action: 'LOGIN_FAILED',
    category: 'auth',
    severity: 'medium',
    ipAddress: '203.0.113.195',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    location: 'Local Desconhecido',
    details: { reason: 'invalid_password', attempts: 3 },
    success: false
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    userId: 'current-user',
    action: '2FA_ENABLED',
    category: 'security',
    severity: 'high',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: 'São Paulo, Brasil',
    details: { method: 'authenticator_app' },
    success: true
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    userId: 'current-user',
    action: 'SUSPICIOUS_LOGIN_BLOCKED',
    category: 'security',
    severity: 'critical',
    ipAddress: '198.51.100.42',
    userAgent: 'curl/7.68.0',
    location: 'Localização Suspeita',
    details: { blocked_reason: 'unusual_location', risk_score: 95 },
    success: false
  }
]

export function AuditLogger() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'auth' | 'security' | 'profile' | 'session'>('all')

  useEffect(() => {
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    setIsLoading(true)
    try {
      // Simular carregamento de logs
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLogs(mockAuditLogs)
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionIcon = (action: string, success: boolean) => {
    const iconClass = "h-4 w-4"
    
    if (!success) {
      return <XCircle className={`${iconClass} text-red-500`} />
    }

    switch (action) {
      case 'LOGIN_SUCCESS':
        return <LogIn className={`${iconClass} text-green-500`} />
      case 'LOGOUT':
        return <LogOut className={`${iconClass} text-blue-500`} />
      case 'PASSWORD_CHANGE':
      case '2FA_ENABLED':
      case '2FA_DISABLED':
        return <Key className={`${iconClass} text-yellow-500`} />
      case 'PROFILE_UPDATE':
        return <Settings className={`${iconClass} text-blue-500`} />
      case 'SUSPICIOUS_LOGIN_BLOCKED':
        return <Shield className={`${iconClass} text-red-500`} />
      default:
        return <CheckCircle className={`${iconClass} text-green-500`} />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive',
      critical: 'destructive'
    } as const

    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    } as const

    return (
      <Badge variant={variants[severity as keyof typeof variants]} className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()}
      </Badge>
    )
  }

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4 text-muted-foreground" />
    }
    return <Monitor className="h-4 w-4 text-muted-foreground" />
  }

  const formatAction = (action: string) => {
    return action.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.category === filter)

  const getCategoryStats = () => {
    const stats = {
      total: logs.length,
      auth: logs.filter(log => log.category === 'auth').length,
      security: logs.filter(log => log.category === 'security').length,
      profile: logs.filter(log => log.category === 'profile').length,
      session: logs.filter(log => log.category === 'session').length,
      failed: logs.filter(log => !log.success).length
    }
    return stats
  }

  const stats = getCategoryStats()

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <LogIn className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Auth</p>
                <p className="text-2xl font-bold text-blue-600">{stats.auth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Segurança</p>
                <p className="text-2xl font-bold text-green-600">{stats.security}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Perfil</p>
                <p className="text-2xl font-bold text-purple-600">{stats.profile}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Sessões</p>
                <p className="text-2xl font-bold text-orange-600">{stats.session}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Falhas</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log de Auditoria de Segurança</CardTitle>
              <CardDescription>
                Histórico detalhado de todas as atividades de segurança da sua conta
              </CardDescription>
            </div>
            <Button onClick={loadAuditLogs} disabled={isLoading} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            {(['all', 'auth', 'security', 'profile', 'session'] as const).map((category) => (
              <Button
                key={category}
                variant={filter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(category)}
              >
                {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum log encontrado para este filtro
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.action, log.success)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">
                          {formatAction(log.action)}
                        </h4>
                        {getSeverityBadge(log.severity)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {log.location || 'Localização não disponível'}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {getDeviceIcon(log.userAgent)}
                          {log.ipAddress}
                        </div>
                        
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-xs">
                            <strong>Detalhes:</strong> {JSON.stringify(log.details)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
