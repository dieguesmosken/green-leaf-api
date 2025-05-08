"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CalendarIcon, Filter } from "lucide-react"
import { useState } from "react"

interface HeatmapControlsProps {
  selectedHeatmap: string | null
  onHeatmapChange: (value: string | null) => void
  dateRange: { from: Date; to: Date }
  onDateRangeChange: (value: { from: Date; to: Date }) => void
  severityFilter: string[]
  onSeverityFilterChange: (value: string[]) => void
}

export function HeatmapControls({
  selectedHeatmap,
  onHeatmapChange,
  dateRange,
  onDateRangeChange,
  severityFilter,
  onSeverityFilterChange,
}: HeatmapControlsProps) {
  const [date, setDate] = useState<{
    from: Date
    to: Date
  }>(dateRange)

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleDateSelect = (value: any) => {
    setDate(value)
    if (value?.from && value?.to) {
      onDateRangeChange(value)
    }
  }

  const handleSeverityChange = (value: string, checked: boolean) => {
    if (checked) {
      onSeverityFilterChange([...severityFilter, value])
    } else {
      onSeverityFilterChange(severityFilter.filter((item) => item !== value))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={selectedHeatmap || ""} onValueChange={(value) => onHeatmapChange(value || null)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select heatmap" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="infection">Infection Rate</SelectItem>
          <SelectItem value="severity">Severity Level</SelectItem>
          <SelectItem value="time">Time Progression</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px]">
          <div className="space-y-4">
            <h4 className="font-medium">Severity Filter</h4>
            <div className="space-y-2">
              {["none", "low", "medium", "high", "severe"].map((severity) => (
                <div key={severity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`severity-${severity}`}
                    checked={severityFilter.includes(severity)}
                    onCheckedChange={(checked) => handleSeverityChange(severity, checked as boolean)}
                  />
                  <Label htmlFor={`severity-${severity}`} className="capitalize">
                    {severity}
                  </Label>
                </div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
