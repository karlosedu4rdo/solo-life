"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Achievement } from "@/lib/types"
import { Trophy, Trash2, ChevronRight, Award } from "lucide-react"

interface AchievementCardProps {
  achievement: Achievement
  onDelete: (id: string) => void
  onClick: (achievement: Achievement) => void
}

export function AchievementCard({ achievement, onDelete, onClick }: AchievementCardProps) {
  const completedTasks = achievement.subTasks.filter((t) => t.completed).length
  const totalTasks = achievement.subTasks.length

  return (
    <Card
      className={`p-4 transition-all hover:border-primary/50 hover:shadow-lg ${
        achievement.completed ? "border-primary/30 bg-primary/5" : ""
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              achievement.completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {achievement.completed ? <Award className="h-6 w-6" /> : <Trophy className="h-6 w-6" />}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(achievement.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{achievement.category}</Badge>
              {achievement.titleReward && (
                <Badge className="bg-primary/20 text-primary">
                  <Award className="mr-1 h-3 w-3" />
                  {achievement.titleReward}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">
              {completedTasks} / {totalTasks} sub-missões
            </span>
          </div>
          <Progress value={achievement.progress} className="h-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{achievement.progress.toFixed(0)}% completo</span>
            <span className="text-xs text-primary">+{achievement.totalXPReward} XP total</span>
          </div>
        </div>

        {achievement.completed ? (
          <div className="rounded-lg bg-primary/10 p-3 text-center">
            <p className="text-sm font-semibold text-primary">Conquista Completa!</p>
            {achievement.completedAt && (
              <p className="text-xs text-muted-foreground">
                {new Date(achievement.completedAt).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        ) : (
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onClick(achievement)}>
            Ver Sub-missões
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
