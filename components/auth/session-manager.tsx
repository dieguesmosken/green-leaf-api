"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  LogOut,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/context/firebase-auth-context"
import { toast } from "sonner"

interface Session {
  id: string
  device: string
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  location: string
  ipAddress: string
  lastActive: Date
  current: boolean
  trusted: boolean
}

export function SessionManager() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setIsRefreshing(true)
      
      // Mock data - em produção seria uma API call
      const mockSessions: Session[] = [
        {
          id: '1',
          device: 'Windows PC',
          deviceType: 'desktop',
          browser: 'Chrome 120.0',
          os: 'Windows 11',
          location: 'São Paulo, SP, Brasil',
          ipAddress: '192.168.1.100',
          lastActive: new Date(),
          current: true,
          trusted: true
        },
        {
          id: '2',
          device: 'iPhone 15',
          deviceType: 'mobile',
          browser: 'Safari 17.0',
          os: 'iOS 17.2',
          location: 'São Paulo, SP, Brasil',
          ipAddress: '192.168.1.101',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          current: false,
          trusted: true
        },
        {
          id: '3',
          device: 'Unknown Device',
          deviceType: 'desktop',
          browser: 'Firefox 119.0',
          os: 'Ubuntu 22.04',
          location: 'Rio de Janeiro, RJ, Brasil',
          ipAddress: '203.0.113.1',
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          current: false,
          trusted: false
        }
      ]
      
      setSessions(mockSessions)
    } catch (error) {
      toast.error("Erro ao carregar sessões")
    } finally {
      setIsRefreshing(false)
    }
  }

  const terminateSession = async (sessionId: string) => {
    try {
      setIsLoading(true)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSessions(prev => prev.filter(session => session.id !== sessionId))
      toast.success("Sessão encerrada com sucesso")
    } catch (error) {
      toast.error("Erro ao encerrar sessão")
    } finally {
      setIsLoading(false)
    }
  }

  const terminateAllOtherSessions = async () => {
    try {
      setIsLoading(true)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSessions(prev => prev.filter(session => session.current))
      toast.success("Todas as outras sessões foram encerradas")
    } catch (error) {
      toast.error("Erro ao encerrar sessões")
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const formatLastActive = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    return `${diffDays}d atrás`
  }

  const activeSessions = sessions.length
  const untrustedSessions = sessions.filter(s => !s.trusted).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Gerenciamento de Sessões
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSessions}
            disabled={isRefreshing}
            className="ml-auto"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Monitore e gerencie todos os dispositivos conectados à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{activeSessions}</div>
            <div className="text-sm text-gray-600">Sessões Ativas</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {activeSessions - untrustedSessions}
            </div>
            <div className="text-sm text-gray-600">Dispositivos Confiáveis</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-red-600">{untrustedSessions}</div>
            <div className="text-sm text-gray-600">Dispositivos Suspeitos</div>
          </div>
        </div>

        {/* Alerts */}
        {untrustedSessions > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Detectamos {untrustedSessions} sessão(ões) de dispositivos não reconhecidos. 
              Verifique e encerre se necessário.
            </AlertDescription>
          </Alert>
        )}

        {/* Bulk Actions */}
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={terminateAllOtherSessions}
            disabled={isLoading || sessions.filter(s => !s.current).length === 0}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Encerrar Todas as Outras Sessões
          </Button>
        </div>

        {/* Sessions Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(session.deviceType)}
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {session.device}
                          {session.current && (
                            <Badge variant="secondary" className="text-xs">
                              Atual
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {session.browser} • {session.os}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <div>
                        <div className="text-sm">{session.location}</div>
                        <div className="text-xs text-gray-500">{session.ipAddress}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{formatLastActive(session.lastActive)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {session.trusted ? (
                        <Badge variant="secondary" className="text-green-700 bg-green-50">
                          Confiável
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          Suspeito
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {!session.current && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => terminateSession(session.id)}
                        disabled={isLoading}
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Encerrar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Session Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-medium">Informações sobre Sessões</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Sessões expiram automaticamente após 7 dias de inatividade</li>
            <li>• Dispositivos suspeitos são detectados por mudanças de localização</li>
            <li>• Encerre sessões de dispositivos que você não reconhece</li>
            <li>• Use 2FA para maior segurança das suas sessões</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
