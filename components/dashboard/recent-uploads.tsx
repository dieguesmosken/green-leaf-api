"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

const uploads = [
  {
    id: "1",
    name: "cassava_leaf_01.jpg",
    uploadedBy: "John Doe",
    uploadDate: "2023-10-15T10:30:00Z",
    status: "analyzed",
    infectionRate: 0.12,
    severity: "low",
  },
  {
    id: "2",
    name: "cassava_leaf_02.jpg",
    uploadedBy: "Jane Smith",
    uploadDate: "2023-10-14T14:45:00Z",
    status: "analyzed",
    infectionRate: 0.67,
    severity: "high",
  },
  {
    id: "3",
    name: "cassava_leaf_03.jpg",
    uploadedBy: "John Doe",
    uploadDate: "2023-10-13T09:15:00Z",
    status: "analyzed",
    infectionRate: 0.05,
    severity: "none",
  },
  {
    id: "4",
    name: "cassava_leaf_04.jpg",
    uploadedBy: "Maria Garcia",
    uploadDate: "2023-10-12T16:20:00Z",
    status: "pending",
    infectionRate: null,
    severity: null,
  },
  {
    id: "5",
    name: "cassava_leaf_05.jpg",
    uploadedBy: "Robert Johnson",
    uploadDate: "2023-10-11T11:10:00Z",
    status: "analyzed",
    infectionRate: 0.45,
    severity: "medium",
  },
]

export function RecentUploads() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Uploaded By</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Infection</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {uploads.map((upload) => (
                <tr
                  key={upload.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${upload.id}`} alt={upload.name} />
                      <AvatarFallback>{upload.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="p-4 align-middle">{upload.name}</td>
                  <td className="p-4 align-middle">{upload.uploadedBy}</td>
                  <td className="p-4 align-middle">{new Date(upload.uploadDate).toLocaleDateString()}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        upload.status === "analyzed" ? "default" : upload.status === "pending" ? "outline" : "secondary"
                      }
                    >
                      {upload.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    {upload.infectionRate !== null ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            upload.severity === "none"
                              ? "bg-green-500"
                              : upload.severity === "low"
                                ? "bg-yellow-500"
                                : upload.severity === "medium"
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }`}
                        />
                        <span>{(upload.infectionRate * 100).toFixed(1)}%</span>
                      </div>
                    ) : (
                      "Pending"
                    )}
                  </td>
                  <td className="p-4 align-middle">
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
                        <DropdownMenuItem>View analysis</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
