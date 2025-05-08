import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileUp } from "lucide-react"
import { UploadsTable } from "@/components/uploads/uploads-table"
import { UploadsFilter } from "@/components/uploads/uploads-filter"

export default function UploadsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Image Uploads" text="Manage and analyze your leaf images">
        <Button>
          <FileUp className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </DashboardHeader>
      <div className="space-y-4">
        <UploadsFilter />
        <UploadsTable />
      </div>
    </DashboardShell>
  )
}
