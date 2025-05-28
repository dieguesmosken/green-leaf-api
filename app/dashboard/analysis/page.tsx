"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalysisFilter } from "@/components/analysis/analysis-filter"
import { AnalysisTable } from "@/components/analysis/analysis-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalysisSummary } from "@/components/analysis/analysis-summary"
import { AnalysisCharts } from "@/components/analysis/analysis-charts"

export default function AnalysisPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Analysis Results" text="View and manage leaf infection analysis results">
        <AnalysisFilter />
      </DashboardHeader>
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Detailed results of leaf infection analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
              <CardDescription>Summary statistics of infection analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisSummary />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Charts</CardTitle>
              <CardDescription>Visual representation of infection data</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisCharts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
