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
const analyses = Array.from({ length: 50 }).map((_, i) => ({
  id: `analysis-${i + 1}`,
  imageName: `cassava_leaf_${(i + 1).toString().padStart(2, "0")}.jpg`,
  date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
  infectionRate: Math.random(),
  severity: ["none", "low", "medium", "high", "severe"][Math.floor(Math.random() * 5)],
  location: ["Vale do Ribeira", "Southern Region", "Central Highlands", "Eastern Farms"][Math.floor(Math.random() * 4)],
  modelVersion: ["1.0.0", "1.1.0", "1.2.0"][Math.floor(Math.random() * 3)],
  verifiedBy: Math.random() > 0.7 ? ["John Doe", "Jane Smith", "Maria Garcia"][Math.floor(Math.random() * 3)] : null,
}))

export function AnalysisTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const pageSize = 10

  const filteredAnalyses = analyses.filter(
    (analysis) =>
      analysis.imageName.toLowerCase().includes(search.toLowerCase()) ||
      analysis.location.toLowerCase().includes(search.toLowerCase()) ||
      analysis.severity.toLowerCase().includes(search.toLowerCase()),
  )

  const paginatedAnalyses = filteredAnalyses.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredAnalyses.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search analyses..."
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
              <TableHead>Image</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Infection Rate</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Model Version</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnalyses.map((analysis) => (
              <TableRow key={analysis.id}>
                <TableCell className="font-medium">{analysis.imageName}</TableCell>
                <TableCell>{new Date(analysis.date).toLocaleDateString()}</TableCell>
                <TableCell>{(analysis.infectionRate * 100).toFixed(1)}%</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      analysis.severity === "none"
                        ? "border-green-500 text-green-500"
                        : analysis.severity === "low"
                          ? "border-yellow-500 text-yellow-500"
                          : analysis.severity === "medium"
                            ? "border-orange-500 text-orange-500"
                            : analysis.severity === "high"
                              ? "border-red-500 text-red-500"
                              : "border-purple-500 text-purple-500"
                    }
                  >
                    {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{analysis.location}</TableCell>
                <TableCell>{analysis.modelVersion}</TableCell>
                <TableCell>
                  {analysis.verifiedBy ? (
                    <Badge variant="secondary">{analysis.verifiedBy}</Badge>
                  ) : (
                    <Badge variant="outline">Unverified</Badge>
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
                      <DropdownMenuItem>View image</DropdownMenuItem>
                      {!analysis.verifiedBy && <DropdownMenuItem>Verify analysis</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Export data</DropdownMenuItem>
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
