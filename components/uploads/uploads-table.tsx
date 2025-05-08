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
import { MoreHorizontal, ChevronLeft, ChevronRight, Search } from "lucide-react"

// Mock data
const uploads = Array.from({ length: 50 }).map((_, i) => ({
  id: `img-${i + 1}`,
  name: `cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
  uploadedBy: ["John Doe", "Jane Smith", "Maria Garcia", "Robert Johnson"][Math.floor(Math.random() * 4)],
  location: ["Vale do Ribeira", "Southern Region", "Central Highlands", "Eastern Farms"][Math.floor(Math.random() * 4)],
  uploadDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  status: ["pending", "analyzed", "failed"][Math.floor(Math.random() * 3)],
  infectionRate: Math.random(),
  severity: ["none", "low", "medium", "high", "severe"][Math.floor(Math.random() * 5)],
}))

export function UploadsTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const pageSize = 10

  const filteredUploads = uploads.filter(
    (upload) =>
      upload.name.toLowerCase().includes(search.toLowerCase()) ||
      upload.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      upload.location.toLowerCase().includes(search.toLowerCase()),
  )

  const paginatedUploads = filteredUploads.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredUploads.length / pageSize)

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Infection</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUploads.map((upload) => (
              <TableRow key={upload.id}>
                <TableCell className="font-medium">{upload.name}</TableCell>
                <TableCell>{upload.uploadedBy}</TableCell>
                <TableCell>{upload.location}</TableCell>
                <TableCell>{new Date(upload.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      upload.status === "analyzed" ? "default" : upload.status === "pending" ? "outline" : "destructive"
                    }
                  >
                    {upload.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {upload.status === "analyzed" ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          upload.severity === "none"
                            ? "bg-green-500"
                            : upload.severity === "low"
                              ? "bg-yellow-500"
                              : upload.severity === "medium"
                                ? "bg-orange-500"
                                : upload.severity === "high"
                                  ? "bg-red-500"
                                  : "bg-purple-500"
                        }`}
                      />
                      <span>{(upload.infectionRate * 100).toFixed(1)}%</span>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      {upload.status === "analyzed" && <DropdownMenuItem>View analysis</DropdownMenuItem>}
                      {upload.status === "pending" && <DropdownMenuItem>Analyze now</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Download</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
