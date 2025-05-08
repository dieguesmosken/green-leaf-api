"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { useState } from "react"

export function UploadsFilter() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [location, setLocation] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<string | undefined>(undefined)

  const clearFilters = () => {
    setDate(undefined)
    setStatus(undefined)
    setLocation(undefined)
    setUser(undefined)
  }

  const hasFilters = date || status || location || user

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

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="analyzed">Analyzed</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="vale-do-ribeira">Vale do Ribeira</SelectItem>
          <SelectItem value="southern-region">Southern Region</SelectItem>
          <SelectItem value="central-highlands">Central Highlands</SelectItem>
          <SelectItem value="eastern-farms">Eastern Farms</SelectItem>
        </SelectContent>
      </Select>

      <Select value={user} onValueChange={setUser}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="User" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          <SelectItem value="john-doe">John Doe</SelectItem>
          <SelectItem value="jane-smith">Jane Smith</SelectItem>
          <SelectItem value="maria-garcia">Maria Garcia</SelectItem>
          <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="rounded-full">
          <X className="h-4 w-4" />
          <span className="sr-only">Clear filters</span>
        </Button>
      )}
    </div>
  )
}
