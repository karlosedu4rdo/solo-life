"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Achievement } from "@/lib/types"
import { Award, Zap, ArrowLeft } from "lucide-react"

interface AchievementDetailProps {
  achievement: Achievement
  onToggleSubTask: (subTaskId: string) => void
  onBack: () => void
}

export function AchievementDetail({ achievement, onToggleSubTask, onBack }: AchievementDetailProps) {
  const completedTasks = achievement.subTasks.filter((t) => t.completed).length
  const totalTasks = achievement.subTasks.length

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-lg ${
                achievement.completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              <Award className="h-8 w-8" />
            </div>

            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{achievement.name}</h2>
              <p className="text-muted-foreground">{achievement.description}</p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{achievement.category}</Badge>
                {achievement.titleReward && (
                  <Badge className="bg-primary/20 text-primary">
                    <Award className="mr-1 h-3 w-3" />
                    Título: {achievement.titleReward}
                  </Badge>
                )}
                <Badge variant="secondary">
                  <Zap className="mr-1 h-3 w-3" />
                  {achievement.totalXPReward} XP Total
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progresso Geral</span>
              <span className="text-muted-foreground">
                {completedTasks} / {totalTasks}
              </span>
            </div>
            <Progress value={achievement.progress} className="h-3" />
            <p className="text-center text-sm font-semibold text-primary">{achievement.progress.toFixed(0)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Sub-missões</h3>
        <div className="space-y-3">
          {achievement.subTasks.map((subTask) => (
            <Card key={subTask.id} className="p-4 transition-all hover:border-primary/50">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={subTask.completed}
                  onCheckedChange={() => onToggleSubTask(subTask.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h4
                    className={`font-medium ${
                      subTask.completed ? "text-muted-foreground line-through" : "text-foreground"
                    }`}
                  >
                    {subTask.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>+{subTask.xpReward} XP</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {achievement.completed && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-card p-6 text-center">
          <Award className="mx-auto mb-3 h-12 w-12 text-primary" />
          <h3 className="mb-2 text-xl font-bold text-primary">Conquista Completa!</h3>
          <p className="text-muted-foreground">
            Você completou todas as sub-missões e ganhou {achievement.totalXPReward} XP
          </p>
          {achievement.titleReward && (
            <p className="mt-2 text-sm font-semibold text-primary">
              Novo título desbloqueado: {achievement.titleReward}
            </p>
          )}
        </Card>
      )}
    </div>
  )
}
