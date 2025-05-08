"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const monthlyData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 25 },
  { name: "Apr", value: 32 },
  { name: "May", value: 28 },
  { name: "Jun", value: 22 },
  { name: "Jul", value: 18 },
  { name: "Aug", value: 29 },
  { name: "Sep", value: 35 },
  { name: "Oct", value: 31 },
  { name: "Nov", value: 24 },
  { name: "Dec", value: 17 },
]

const severityData = [
  { name: "None", value: 15, color: "#2dc937" },
  { name: "Low", value: 25, color: "#e7b416" },
  { name: "Medium", value: 35, color: "#db7b2b" },
  { name: "High", value: 20, color: "#cc3232" },
  { name: "Severe", value: 5, color: "#80024e" },
]

const regionData = [
  { name: "Vale do Ribeira", none: 20, low: 30, medium: 25, high: 15, severe: 10 },
  { name: "Southern Region", none: 15, low: 25, medium: 35, high: 20, severe: 5 },
  { name: "Central Highlands", none: 10, low: 20, medium: 30, high: 30, severe: 10 },
  { name: "Eastern Farms", none: 25, low: 35, medium: 20, high: 15, severe: 5 },
]

export function AnalysisCharts() {
  return (
    <Tabs defaultValue="trend">
      <TabsList className="mb-4">
        <TabsTrigger value="trend">Trend</TabsTrigger>
        <TabsTrigger value="severity">Severity</TabsTrigger>
        <TabsTrigger value="regional">Regional</TabsTrigger>
      </TabsList>
      <TabsContent value="trend">
        <Card>
          <CardHeader>
            <CardTitle>Infection Rate Trend</CardTitle>
            <CardDescription>Monthly average infection rate over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Infection Rate"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Infection Rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="severity">
        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Distribution of infection severity across all analyses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="regional">
        <Card>
          <CardHeader>
            <CardTitle>Regional Comparison</CardTitle>
            <CardDescription>Comparison of infection severity across different regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                  <Legend />
                  <Bar dataKey="none" name="None" fill="#2dc937" stackId="a" />
                  <Bar dataKey="low" name="Low" fill="#e7b416" stackId="a" />
                  <Bar dataKey="medium" name="Medium" fill="#db7b2b" stackId="a" />
                  <Bar dataKey="high" name="High" fill="#cc3232" stackId="a" />
                  <Bar dataKey="severe" name="Severe" fill="#80024e" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
