import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { getStatRank, getStatColor } from "@/lib/game-logic"

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  maxValue?: number
  showRank?: boolean
  className?: string
}

export function StatCard({ icon, label, value, maxValue = 100, showRank = true, className }: StatCardProps) {
  const rank = getStatRank(value)
  const colorClass = getStatColor(value)
  const percentage = Math.min((value / maxValue) * 100, 100)

  return (
    <Card className={cn("relative overflow-hidden p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("text-2xl font-bold", colorClass)}>{value}</p>
          </div>
        </div>
        {showRank && <div className={cn("text-3xl font-bold opacity-20", colorClass)}>{rank}</div>}
      </div>

      {/* Background progress indicator */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-muted">
        <div className="h-full bg-primary/30 transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
    </Card>
  )
}
