"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalysisSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Infection Distribution</CardTitle>
          <CardDescription>Distribution of infection severity across all analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "None", value: 15, color: "bg-green-500" },
              { label: "Low", value: 25, color: "bg-yellow-500" },
              { label: "Medium", value: 35, color: "bg-orange-500" },
              { label: "High", value: 20, color: "bg-red-500" },
              { label: "Severe", value: 5, color: "bg-purple-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={item.color}
                      style={{ width: `${item.value}%` }}
                      role="progressbar"
                      aria-valuenow={item.value}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <span className="text-sm">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Regional Analysis</CardTitle>
          <CardDescription>Average infection rates by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Vale do Ribeira", value: 32 },
              { label: "Southern Region", value: 28 },
              { label: "Central Highlands", value: 45 },
              { label: "Eastern Farms", value: 19 },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="bg-primary"
                    style={{ width: `${item.value}%` }}
                    role="progressbar"
                    aria-valuenow={item.value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Analysis Statistics</CardTitle>
          <CardDescription>Key statistics from all analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Infection</p>
                <p className="text-2xl font-bold">31.2%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last 30 Days</p>
                <p className="text-2xl font-bold">87</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Most Common Severity</p>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <p className="font-medium">Medium (35%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
