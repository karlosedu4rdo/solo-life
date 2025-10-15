"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Target, 
  Zap, 
  Flame, 
  Star, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyProgress {
  completedHabits: number
  totalHabits: number
  streak: number
  todayXP: number
  weeklyGoal: number
  weeklyProgress: number
  nextMilestone: {
    xp: number
    remaining: number
  }
}

interface DailyProgressCardProps {
  progress: DailyProgress
  onViewDetails?: () => void
}

export function DailyProgressCard({ progress, onViewDetails }: DailyProgressCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const completionRate = progress.totalHabits > 0 
    ? (progress.completedHabits / progress.totalHabits) * 100 
    : 0

  const weeklyProgressRate = (progress.weeklyProgress / progress.weeklyGoal) * 100

  useEffect(() => {
    // Animate progress bars
    const timer = setTimeout(() => {
      setIsAnimating(true)
      setAnimatedProgress(completionRate)
    }, 300)
    return () => clearTimeout(timer)
  }, [completionRate])

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥"
    if (streak >= 14) return "🔥🔥"
    if (streak >= 7) return "🔥"
    if (streak >= 3) return "⭐"
    return "💪"
  }

  const getMotivationalMessage = () => {
    if (completionRate === 100) return "Perfeito! Você dominou o dia! 🎉"
    if (completionRate >= 80) return "Excelente! Quase lá! 💪"
    if (completionRate >= 60) return "Bom trabalho! Continue assim! ⭐"
    if (completionRate >= 40) return "Você está no caminho certo! 🚀"
    if (completionRate >= 20) return "Cada passo conta! 💫"
    return "Vamos começar sua jornada épica! 🌟"
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-2 border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Progresso Diário</h3>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", { 
                  weekday: "long", 
                  day: "numeric", 
                  month: "long" 
                })}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-bold text-primary">
              <Flame className="h-4 w-4" />
              <span>{progress.streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Sequência</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {/* Daily Habits Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hábitos de Hoje</span>
              <span className="text-sm font-bold text-primary">
                {progress.completedHabits}/{progress.totalHabits}
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={animatedProgress} 
                className="h-3"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {Math.round(completionRate)}%
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Goal Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meta Semanal</span>
              <span className="text-sm font-bold text-accent">
                {progress.weeklyProgress}/{progress.weeklyGoal} XP
              </span>
            </div>
            <Progress 
              value={weeklyProgressRate} 
              className="h-2"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-lg font-bold">{progress.todayXP}</span>
            </div>
            <p className="text-xs text-muted-foreground">XP Hoje</p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-bold">{progress.nextMilestone.remaining}</span>
            </div>
            <p className="text-xs text-muted-foreground">Próximo Marco</p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-center">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Streak Display */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{getStreakEmoji(progress.streak)}</span>
          <div className="text-center">
            <p className="text-sm font-bold">{progress.streak} dias</p>
            <p className="text-xs text-muted-foreground">de sequência</p>
          </div>
        </div>

        {/* Action Button */}
        {onViewDetails && (
          <Button 
            onClick={onViewDetails}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Ver Detalhes
          </Button>
        )}
      </div>
    </Card>
  )
}
