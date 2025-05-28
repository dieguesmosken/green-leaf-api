"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ChevronLeft, ChevronRight, Search, Eye, Download, Trash2 } from "lucide-react"
import { useUploadContext } from "@/context/upload-context"
import { toast } from "sonner"

// Mock data for demonstration (will be replaced by real data when uploads exist)
const generateMockUploads = () => Array.from({ length: 20 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  fileName: `cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
  status: ["success", "failed", "pending"][Math.floor(Math.random() * 3)] as "success" | "failed" | "pending",
  timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
  provider: ["Imgur", "Cloudinary", "Local"][Math.floor(Math.random() * 3)],
  size: Math.random() * 10,
  url: `https://example.com/image-${i + 1}.jpg`,
  uploadedBy: ["John Doe", "Jane Smith", "Maria Garcia", "Robert Johnson"][Math.floor(Math.random() * 4)],
  location: ["Vale do Ribeira", "Southern Region", "Central Highlands", "Eastern Farms"][Math.floor(Math.random() * 4)],
  infectionRate: Math.random(),
  severity: ["none", "low", "medium", "high", "severe"][Math.floor(Math.random() * 5)],
}))

export function UploadsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const pageSize = 10
  
  const { uploads: realUploads, removeUpload } = useUploadContext()
  
  // Combinar uploads reais com dados mock para demonstração
  const mockUploads = generateMockUploads()
  const allUploads = [...realUploads, ...mockUploads]
  const filteredUploads = allUploads.filter(
    (upload) =>
      upload.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (upload.provider && upload.provider.toLowerCase().includes(search.toLowerCase())) ||
      ((upload as any).uploadedBy && (upload as any).uploadedBy.toLowerCase().includes(search.toLowerCase()))
  )

  const paginatedUploads = filteredUploads.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredUploads.length / pageSize)

  const handleDelete = (uploadId: string) => {
    removeUpload(uploadId)
    toast.success("Upload removido com sucesso")
  }

  const handleViewImage = (url?: string) => {
    if (url) {
      window.open(url, '_blank')
    } else {
      toast.error("URL da imagem não disponível")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
      case "analyzed":
        return "default"
      case "pending":
        return "outline"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatFileSize = (size: number) => {
    return `${size.toFixed(2)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search uploads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>          <TableHeader>
            <TableRow>
              <TableHead>Nome do Arquivo</TableHead>
              <TableHead>Provedor</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Infecção</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>          <TableBody>
            {paginatedUploads.map((upload) => {
              // Handle both real uploads and mock data
              const fileName = upload.fileName || (upload as any).name
              const provider = upload.provider || "Desconhecido"
              const size = upload.size ? formatFileSize(upload.size) : "N/A"
              const date = upload.timestamp ? upload.timestamp.toLocaleDateString() : 
                         (upload as any).uploadDate ? new Date((upload as any).uploadDate).toLocaleDateString() : "N/A"
              const status = upload.status
              const infectionRate = (upload as any).infectionRate
              const severity = (upload as any).severity
              const url = upload.url
              
              return (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">{fileName}</TableCell>
                  <TableCell>{provider}</TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(status)}>
                      {status === "success" ? "Sucesso" : 
                       status === "failed" ? "Falhou" : 
                       status === "pending" ? "Pendente" : 
                       status === "analyzed" ? "Analisado" : status}
                    </Badge>
                  </TableCell>                  <TableCell>
                    {(status === "success" || (upload as any).status === "analyzed") && infectionRate !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            severity === "none"
                              ? "bg-green-500"
                              : severity === "low"
                                ? "bg-yellow-500"
                                : severity === "medium"
                                  ? "bg-orange-500"
                                  : severity === "high"
                                    ? "bg-red-500"
                                    : "bg-purple-500"
                          }`}
                        />
                        <span>{(infectionRate * 100).toFixed(1)}%</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        {url && (
                          <DropdownMenuItem onClick={() => handleViewImage(url)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver imagem
                          </DropdownMenuItem>
                        )}                        {(status === "success" || (upload as any).status === "analyzed") && (
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver análise
                          </DropdownMenuItem>
                        )}
                        {status === "pending" && (
                          <DropdownMenuItem>
                            Analisar agora
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {url && (
                          <DropdownMenuItem onClick={() => window.open(url, '_blank')}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(upload.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
