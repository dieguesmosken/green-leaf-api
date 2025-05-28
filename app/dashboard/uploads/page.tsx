"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileUp, RefreshCw } from "lucide-react"
import { UploadsTable } from "@/components/uploads/uploads-table"
import { UploadsFilter } from "@/components/uploads/uploads-filter"
import { QuickUpload } from "@/components/dashboard/quick-upload"
import { useUploadContext } from "@/context/upload-context"
import { useState } from "react"

export default function UploadsPage() {
  const [showQuickUpload, setShowQuickUpload] = useState(false)
  const { uploads, getStats, clearUploads } = useUploadContext()
  const stats = getStats()

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Uploads de Imagens" 
        text={`Gerencie e analise suas imagens de folhas. Total: ${stats.total} uploads`}
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <QuickUpload />
        </div>
      </DashboardHeader>
      
      {uploads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum upload encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece fazendo upload de suas primeiras imagens de folhas para análise.
          </p>
          <QuickUpload />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-sm text-muted-foreground">Sucessos</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-muted-foreground">Falhas</div>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
              </div>
            </div>
          </div>
          <UploadsFilter />
          <UploadsTable />
        </div>
      )}
    </DashboardShell>
  )
}
