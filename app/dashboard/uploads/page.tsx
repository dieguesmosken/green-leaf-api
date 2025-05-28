"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"
import { UploadsTable } from "@/components/uploads/uploads-table"
import { UploadsFilter } from "@/components/uploads/uploads-filter"
import { ImageUpload } from "@/components/uploads/image-upload"
import { FirebaseUploadsTable } from "@/components/uploads/firebase-uploads-table"

export default function UploadsPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Verificar se deve usar Firebase
  const useFirebaseAuth = process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH === 'true'

  const handleUploadComplete = (urls: string[]) => {
    console.log('Uploaded URLs:', urls)
    setShowUpload(false)
    setRefreshKey(prev => prev + 1) // Força refresh da lista
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Image Uploads" text="Manage and analyze your leaf images">
        <Button onClick={() => setShowUpload(true)}>
          <FileUp className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
        {showUpload && (
          <ImageUpload 
            onUploadComplete={handleUploadComplete}
            maxFiles={10}
            folder="leaf-analysis"
          />
        )}
        
        {useFirebaseAuth ? (
          <FirebaseUploadsTable key={refreshKey} />
        ) : (
          <>
            <UploadsFilter />
            <UploadsTable />
          </>
        )}
      </div>
    </DashboardShell>
  )
}
