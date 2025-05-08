"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { format } from "date-fns"
import { CalendarIcon, Filter, X } from "lucide-react"
import { useState } from "react"

export function AnalysisFilter() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [severity, setSeverity] = useState<string | undefined>(undefined)
  const [infectionRange, setInfectionRange] = useState<[number, number]>([0, 100])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const clearFilters = () => {
    setDate(undefined)
    setSeverity(undefined)
    setInfectionRange([0, 100])
  }

  const hasFilters = date || severity || infectionRange[0] > 0 || infectionRange[1] < 100

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Select value={severity} onValueChange={setSeverity}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="severe">Severe</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Infection Rate
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px]">
          <div className="space-y-4">
            <h4 className="font-medium">Infection Rate Range</h4>
            <div className="px-1">
              <Slider
                defaultValue={infectionRange}
                min={0}
                max={100}
                step={1}
                value={infectionRange}
                onValueChange={(value) => setInfectionRange(value as [number, number])}
              />
              <div className="flex justify-between text-xs mt-1">
                <span>{infectionRange[0]}%</span>
                <span>{infectionRange[1]}%</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
              Apply Filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  )
}
