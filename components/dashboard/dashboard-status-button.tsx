"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { SystemStatusDialog } from "./system-status-dialog"
import { cn } from "@/lib/utils"

interface DashboardStatusButtonProps {
  className?: string
}

export function DashboardStatusButton({ className }: DashboardStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [overallStatus, setOverallStatus] = useState<"healthy" | "warning" | "error" | "loading">("loading")

  const getStatusIcon = () => {
    switch (overallStatus) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (overallStatus) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "loading":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = () => {
    switch (overallStatus) {
      case "healthy":
        return "Sistema Operacional"
      case "warning":
        return "Atenção Necessária"
      case "error":
        return "Problemas Detectados"
      case "loading":
        return "Verificando..."
    }
  }

  const handleStatusUpdate = (status: "healthy" | "warning" | "error") => {
    setOverallStatus(status)
  }

  return (
    <>
      <Button
        variant="outline"
        className={cn("gap-2", className)}
        onClick={() => setIsOpen(true)}
      >
        <Activity className="h-4 w-4" />
        Status
        <Badge 
          variant="secondary" 
          className={cn("ml-1 gap-1", getStatusColor())}
        >
          {getStatusIcon()}
          <span className="text-xs">{getStatusText()}</span>
        </Badge>
      </Button>

      <SystemStatusDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onStatusChange={handleStatusUpdate}
      />
    </>
  )
}
