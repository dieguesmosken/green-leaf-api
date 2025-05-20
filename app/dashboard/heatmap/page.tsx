"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeatmapControls } from "@/components/heatmap/heatmap-controls"
import { HeatmapLegend } from "@/components/heatmap/heatmap-legend"
import { HeatmapView } from "@/components/heatmap/heatmap-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function HeatmapPage() {
  const [selectedHeatmap, setSelectedHeatmap] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [severityFilter, setSeverityFilter] = useState<string[]>(["low", "medium", "high", "severe"])

  return (
    <DashboardShell>
      <DashboardHeader heading="Infection Heatmap" text="Visualize infection distribution across regions">
        <HeatmapControls
          selectedHeatmap={selectedHeatmap}
          onHeatmapChange={setSelectedHeatmap}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
        />
      </DashboardHeader>
      <div className="grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mapa de distribuição de infecções</CardTitle>
            <CardDescription>Mapa de calor mostrando a distribuição e intensidade das infecções bacterianas</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] w-full relative">
              <HeatmapView selectedHeatmap={selectedHeatmap} dateRange={dateRange} severityFilter={severityFilter} />
              <div className="absolute bottom-4 right-4 z-10">
                <HeatmapLegend />
              </div>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="regions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="regions">Regiões</TabsTrigger>
            <TabsTrigger value="statistics">Estatisticas</TabsTrigger>
          </TabsList>
          <TabsContent value="regions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Região</CardTitle>
                <CardDescription>Estatísticas detalhadas de infecção por região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Vale do Ribeira", "Southern Region", "Central Highlands"].map((region) => (
                      <Card key={region}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">{region}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{Math.floor(Math.random() * 40) + 10}%</div>
                          <p className="text-xs text-muted-foreground">Taxa de infecção</p>
                          <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${Math.floor(Math.random() * 40) + 10}%`,
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="statistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Infection Statistics</CardTitle>
                <CardDescription>Overall infection statistics across all regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Severity Distribution</h3>
                      <div className="space-y-2">
                        {["None", "Low", "Medium", "High", "Severe"].map((severity) => (
                          <div key={severity} className="flex items-center justify-between">
                            <span>{severity}</span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    severity === "None"
                                      ? "bg-green-500"
                                      : severity === "Low"
                                        ? "bg-yellow-500"
                                        : severity === "Medium"
                                          ? "bg-orange-500"
                                          : severity === "High"
                                            ? "bg-red-500"
                                            : "bg-purple-500"
                                  }`}
                                  style={{
                                    width: `${Math.floor(Math.random() * 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm">{Math.floor(Math.random() * 100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Time Trend</h3>
                      <p className="text-sm text-muted-foreground mb-4">Infection rate over the last 6 months</p>
                      <div className="h-40 flex items-end gap-1">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-primary rounded-t"
                              style={{
                                height: `${Math.floor(Math.random() * 80) + 20}%`,
                              }}
                            />
                            <span className="text-xs">
                              {new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
