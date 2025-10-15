"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { DailyMission } from "@/lib/types"
import { Zap } from "lucide-react"

interface DailyMissionCardProps {
  mission: DailyMission
  onComplete: (missionId: string) => void
}

export function DailyMissionCard({ mission, onComplete }: DailyMissionCardProps) {
  return (
    <Card className="p-4 transition-all hover:border-primary/50">
      <div className="flex items-start gap-3">
        <Checkbox checked={mission.completed} onCheckedChange={() => onComplete(mission.id)} className="mt-1" />
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`font-medium ${mission.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
            >
              {mission.name}
            </h4>
            <Badge variant="outline" className="shrink-0">
              {mission.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>+{mission.xpReward} XP</span>
            {mission.statReward && (
              <span className="text-accent">
                +{mission.statReward.amount} {mission.statReward.stat}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
