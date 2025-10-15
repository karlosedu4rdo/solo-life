"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Trophy } from "lucide-react"

interface AchievementsShowcaseProps {
  titles: string[]
  completedAchievements: number
  totalAchievements: number
}

export function AchievementsShowcase({ titles, completedAchievements, totalAchievements }: AchievementsShowcaseProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Títulos e Conquistas</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Conquistas Completas</p>
              <p className="text-2xl font-bold text-foreground">
                {completedAchievements} / {totalAchievements}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">
              {totalAchievements > 0 ? Math.round((completedAchievements / totalAchievements) * 100) : 0}%
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h4 className="font-semibold text-foreground">Títulos Desbloqueados ({titles.length})</h4>
          </div>

          {titles.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">Nenhum título desbloqueado ainda</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {titles.map((title) => (
                <Badge key={title} variant="outline" className="border-primary text-primary">
                  {title}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
