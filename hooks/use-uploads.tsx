"use client"

import { useState, useCallback } from "react"
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

interface UseUploadsReturn {
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

export function useUploads(): UseUploadsReturn {
  const [uploads, setUploads] = useState<UploadItem[]>([])

  const addUpload = useCallback((file: File, result: UploadResult) => {
    const uploadItem: UploadItem = {
      id: Date.now().toString(),
      fileName: file.name,
      status: result.success ? "success" : "failed",
      timestamp: new Date(),
      provider: result.provider || "unknown",
      size: Number((file.size / (1024 * 1024)).toFixed(2)), // MB
      url: result.url,
      error: result.error
    }

    setUploads(prev => [uploadItem, ...prev].slice(0, 50)) // Manter apenas os 50 mais recentes
  }, [])

  const removeUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id))
  }, [])

  const clearUploads = useCallback(() => {
    setUploads([])
  }, [])

  const getStats = useCallback(() => {
    const total = uploads.length
    const successful = uploads.filter(u => u.status === "success").length
    const failed = uploads.filter(u => u.status === "failed").length
    const pending = uploads.filter(u => u.status === "pending").length
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0

    return {
      total,
      successful,
      failed,
      pending,
      successRate
    }
  }, [uploads])

  return {
    uploads,
    addUpload,
    removeUpload,
    clearUploads,
    getStats
  }
}
