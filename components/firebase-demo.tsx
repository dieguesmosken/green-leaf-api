'use client'

import { useState } from 'react'
import { useFirebaseStorage, useFirebaseUser, useFirebaseCollection } from '@/hooks/use-firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Trash2, Upload, RefreshCw } from 'lucide-react'

export default function FirebaseDemo() {
  const { uploadFile, deleteFile, isUploading, uploadProgress } = useFirebaseStorage()
  const { userData, updateUser, isLoading: userLoading } = useFirebaseUser()
  const { data: heatmaps, addDocument, deleteDocument, refresh, isLoading: heatmapsLoading } = useFirebaseCollection('heatmaps')
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newHeatmapData, setNewHeatmapData] = useState({
    title: '',
    description: '',
    data: ''
  })

  const handleFileUpload = async () => {
    if (!selectedFile) return

    try {
      const downloadURL = await uploadFile(selectedFile, 'demos/')
      console.log('Arquivo enviado:', downloadURL)
      setSelectedFile(null)
    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  const handleUserUpdate = async () => {
    try {
      await updateUser({
        lastUpdated: new Date(),
        demoUsed: true
      })
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  const handleCreateHeatmap = async () => {
    if (!newHeatmapData.title) return

    try {
      await addDocument({
        ...newHeatmapData,
        data: newHeatmapData.data ? JSON.parse(newHeatmapData.data) : [],
        demo: true
      })
      
      setNewHeatmapData({ title: '', description: '', data: '' })
    } catch (error) {
      console.error('Erro ao criar heatmap:', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">🔥 Firebase Demo</h1>
        <p className="text-muted-foreground">
          Demonstração das funcionalidades do Firebase integradas ao Green Leaf API
        </p>
      </div>

      <Tabs defaultValue="storage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="user">Usuário</TabsTrigger>
          <TabsTrigger value="firestore">Firestore</TabsTrigger>
        </TabsList>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                Firebase Storage
              </CardTitle>
              <CardDescription>
                Teste o upload de arquivos para o Firebase Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress.toFixed(0)}% concluído
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Usuário</CardTitle>
              <CardDescription>
                Visualize e atualize os dados do usuário no Firestore
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLoading ? (
                <p>Carregando dados do usuário...</p>
              ) : userData ? (
                <div className="space-y-2">
                  <div>
                    <strong>Email:</strong> {userData.email}
                  </div>
                  <div>
                    <strong>Nome:</strong> {userData.name || 'Não informado'}
                  </div>
                  <div>
                    <strong>Função:</strong> 
                    <Badge variant="outline" className="ml-2">
                      {userData.role || 'user'}
                    </Badge>
                  </div>
                  <div>
                    <strong>Última atualização:</strong> 
                    {userData.lastUpdated ? new Date(userData.lastUpdated.seconds * 1000).toLocaleString() : 'Nunca'}
                  </div>
                </div>
              ) : (
                <p>Nenhum dado encontrado</p>
              )}
              
              <Button onClick={handleUserUpdate} disabled={userLoading}>
                Atualizar Dados
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firestore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Coleção Heatmaps
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCw size={16} />
                </Button>
              </CardTitle>
              <CardDescription>
                Gerencie documentos na coleção de heatmaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Título do heatmap"
                  value={newHeatmapData.title}
                  onChange={(e) => setNewHeatmapData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Descrição"
                  value={newHeatmapData.description}
                  onChange={(e) => setNewHeatmapData(prev => ({ ...prev, description: e.target.value }))}
                />
                <Textarea
                  placeholder="Dados JSON (opcional)"
                  value={newHeatmapData.data}
                  onChange={(e) => setNewHeatmapData(prev => ({ ...prev, data: e.target.value }))}
                />
                <Button onClick={handleCreateHeatmap} disabled={!newHeatmapData.title}>
                  Criar Heatmap
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Heatmaps existentes:</h4>
                {heatmapsLoading ? (
                  <p>Carregando...</p>
                ) : heatmaps.length > 0 ? (
                  <div className="space-y-2">
                    {heatmaps.map((heatmap) => (
                      <div key={heatmap.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{heatmap.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {heatmap.description}
                          </div>
                          {heatmap.demo && (
                            <Badge variant="secondary" className="mt-1">Demo</Badge>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteDocument(heatmap.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum heatmap encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
