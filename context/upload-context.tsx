"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useUploads } from "@/hooks/use-uploads"
import { UploadResult } from "@/lib/multi-upload"

interface UploadItem {
  id: string
  fileName: string
  status: "success" | "failed" | "pending"
  timestamp: Date
  provider: string
  size: number
  url?: string
  error?: string
}

interface UploadContextValue {
  uploads: UploadItem[]
  addUpload: (file: File, result: UploadResult) => void
  removeUpload: (id: string) => void
  clearUploads: () => void
  getStats: () => {
    total: number
    successful: number
    failed: number
    pending: number
    successRate: number
  }
}

const UploadContext = createContext<UploadContextValue | undefined>(undefined)

interface UploadProviderProps {
  children: ReactNode
}

export function UploadProvider({ children }: UploadProviderProps) {
  const uploadState = useUploads()

  return (
    <UploadContext.Provider value={uploadState}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUploadContext() {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error("useUploadContext must be used within an UploadProvider")
  }
  return context
}
