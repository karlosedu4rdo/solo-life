"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActivityHeatmapProps {
  title: string
  data: Record<string, number> // date -> activity count
}

export function ActivityHeatmap({ title, data }: ActivityHeatmapProps) {
  // Generate last 12 weeks
  const weeks: Array<Array<{ date: string; count: number }>> = []
  const today = new Date()

  for (let week = 11; week >= 0; week--) {
    const weekDays: Array<{ date: string; count: number }> = []

    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(date.getDate() - week * 7 - (6 - day))
      const dateStr = date.toISOString().split("T")[0]
      weekDays.push({
        date: dateStr,
        count: data[dateStr] || 0,
      })
    }

    weeks.push(weekDays)
  }

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted"
    if (count <= 2) return "bg-primary/30"
    if (count <= 4) return "bg-primary/60"
    return "bg-primary"
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className={cn("h-3 w-3 rounded-sm transition-colors", getIntensityClass(day.count))}
                  title={`${day.date}: ${day.count} atividades`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <div className="h-3 w-3 rounded-sm bg-primary/30" />
            <div className="h-3 w-3 rounded-sm bg-primary/60" />
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span>Mais</span>
        </div>
      </div>
    </Card>
  )
}
