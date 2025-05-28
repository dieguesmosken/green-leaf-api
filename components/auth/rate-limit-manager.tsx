"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/firebase-auth-context"
import { 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Timer,
  Activity,
  TrendingUp,
  Settings
} from "lucide-react"
import { toast } from "sonner"

export interface RateLimitRule {
  id: string
  name: string
  endpoint: string
  maxRequests: number
  windowMinutes: number
  enabled: boolean
  description: string
}

export interface RateLimitStatus {
  endpoint: string
  currentCount: number
  maxRequests: number
  windowStart: string
  windowEnd: string
  remainingRequests: number
  resetTime: string
}

const defaultRules: RateLimitRule[] = [
  {
    id: 'auth-login',
    name: 'Login',
    endpoint: '/api/auth/login',
    maxRequests: 5,
    windowMinutes: 15,
    enabled: true,
    description: 'Limite de tentativas de login para prevenir ataques de força bruta'
  },
  {
    id: 'auth-register',
    name: 'Registro',
    endpoint: '/api/auth/register',
    maxRequests: 3,
    windowMinutes: 60,
    enabled: true,
    description: 'Limite de criação de contas para prevenir spam'
  },
  {
    id: 'password-reset',
    name: 'Reset de Senha',
    endpoint: '/api/auth/reset-password',
    maxRequests: 3,
    windowMinutes: 60,
    enabled: true,
    description: 'Limite de solicitações de reset de senha'
  },
  {
    id: 'email-verification',
    name: 'Verificação Email',
    endpoint: '/api/auth/verify-email',
    maxRequests: 5,
    windowMinutes: 60,
    enabled: true,
    description: 'Limite de envios de email de verificação'
  },
  {
    id: 'profile-update',
    name: 'Atualizar Perfil',
    endpoint: '/api/profile/update',
    maxRequests: 10,
    windowMinutes: 60,
    enabled: true,
    description: 'Limite de atualizações de perfil'
  },
  {
    id: 'upload-analysis',
    name: 'Upload Análise',
    endpoint: '/api/analysis/upload',
    maxRequests: 20,
    windowMinutes: 60,
    enabled: true,
    description: 'Limite de uploads de análises'
  }
]

const mockCurrentUsage: RateLimitStatus[] = [
  {
    endpoint: '/api/auth/login',
    currentCount: 2,
    maxRequests: 5,
    windowStart: new Date(Date.now() - 600000).toISOString(),
    windowEnd: new Date(Date.now() + 300000).toISOString(),
    remainingRequests: 3,
    resetTime: new Date(Date.now() + 300000).toISOString()
  },
  {
    endpoint: '/api/profile/update',
    currentCount: 1,
    maxRequests: 10,
    windowStart: new Date(Date.now() - 1800000).toISOString(),
    windowEnd: new Date(Date.now() + 1800000).toISOString(),
    remainingRequests: 9,
    resetTime: new Date(Date.now() + 1800000).toISOString()
  }
]

export function RateLimitManager() {
  const { user } = useAuth()
  const [rules, setRules] = useState<RateLimitRule[]>(defaultRules)
  const [currentUsage, setCurrentUsage] = useState<RateLimitStatus[]>(mockCurrentUsage)
  const [isLoading, setIsLoading] = useState(false)
  const [editingRule, setEditingRule] = useState<string | null>(null)

  useEffect(() => {
    loadRateLimitStatus()
    const interval = setInterval(loadRateLimitStatus, 30000) // Atualizar a cada 30 segundos
    return () => clearInterval(interval)
  }, [])

  const loadRateLimitStatus = async () => {
    try {
      // Simular carregamento do status atual
      // Em implementação real, faria chamada para API
      setCurrentUsage(mockCurrentUsage)
    } catch (error) {
      console.error('Erro ao carregar status de rate limiting:', error)
    }
  }

  const updateRule = async (ruleId: string, updates: Partial<RateLimitRule>) => {
    setIsLoading(true)
    try {
      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ))
      toast.success("Regra atualizada com sucesso!")
    } catch (error) {
      toast.error("Erro ao atualizar regra")
    } finally {
      setIsLoading(false)
      setEditingRule(null)
    }
  }

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    await updateRule(ruleId, { enabled })
  }

  const getRuleUsage = (endpoint: string) => {
    return currentUsage.find(usage => usage.endpoint === endpoint)
  }

  const getUsagePercentage = (usage: RateLimitStatus) => {
    return (usage.currentCount / usage.maxRequests) * 100
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  const formatTimeRemaining = (resetTime: string) => {
    const remaining = new Date(resetTime).getTime() - Date.now()
    if (remaining <= 0) return "Reset disponível"
    
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getTotalActiveRules = () => rules.filter(rule => rule.enabled).length
  const getTotalBlocked = () => currentUsage.reduce((sum, usage) => 
    usage.currentCount >= usage.maxRequests ? sum + 1 : sum, 0
  )

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Regras Ativas</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalActiveRules()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Endpoints Monitorados</p>
                <p className="text-2xl font-bold text-green-600">{rules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Bloqueios Ativos</p>
                <p className="text-2xl font-bold text-red-600">{getTotalBlocked()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Uso Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currentUsage.reduce((sum, usage) => sum + usage.currentCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status Atual</TabsTrigger>
          <TabsTrigger value="rules">Configurar Regras</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Status de Rate Limiting</CardTitle>
              <CardDescription>
                Uso atual dos endpoints com rate limiting ativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.filter(rule => rule.enabled).map((rule) => {
                  const usage = getRuleUsage(rule.endpoint)
                  const percentage = usage ? getUsagePercentage(usage) : 0
                  
                  return (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.endpoint}</p>
                        </div>
                        <div className="text-right">
                          {usage ? (
                            <>
                              <div className={`text-sm font-medium ${getUsageColor(percentage)}`}>
                                {usage.currentCount}/{usage.maxRequests} requests
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Reset em: {formatTimeRemaining(usage.resetTime)}
                              </div>
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Nenhum uso recente
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {usage && (
                        <div className="space-y-2">
                          <Progress value={percentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Janela: {rule.windowMinutes} minutos</span>
                            <span>
                              {usage.remainingRequests} requests restantes
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Regras</CardTitle>
              <CardDescription>
                Configure os limites de rate limiting para cada endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">{rule.endpoint}</p>
                          </div>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                          />
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {rule.description}
                        </p>

                        {editingRule === rule.id ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`max-${rule.id}`}>Máximo de Requests</Label>
                              <Input
                                id={`max-${rule.id}`}
                                type="number"
                                value={rule.maxRequests}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  setRules(prev => prev.map(r => 
                                    r.id === rule.id ? { ...r, maxRequests: value } : r
                                  ))
                                }}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`window-${rule.id}`}>Janela (minutos)</Label>
                              <Input
                                id={`window-${rule.id}`}
                                type="number"
                                value={rule.windowMinutes}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  setRules(prev => prev.map(r => 
                                    r.id === rule.id ? { ...r, windowMinutes: value } : r
                                  ))
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="outline">
                              <Zap className="h-3 w-3 mr-1" />
                              {rule.maxRequests} requests
                            </Badge>
                            <Badge variant="outline">
                              <Timer className="h-3 w-3 mr-1" />
                              {rule.windowMinutes} min
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {editingRule === rule.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateRule(rule.id, rules.find(r => r.id === rule.id)!)}
                              disabled={isLoading}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRule(null)
                                setRules(defaultRules) // Reset changes
                              }}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRule(rule.id)}
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
