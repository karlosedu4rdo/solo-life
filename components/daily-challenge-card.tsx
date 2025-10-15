"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Star,
  Trophy,
  Flame,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyChallenge {
  id: string
  title: string
  description: string
  category: "health" | "study" | "finance" | "creativity" | "social"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  xpReward: number
  timeEstimate: number // in minutes
  progress: number // 0-100
  completed: boolean
  streakBonus: number
  expiresAt: string
}

interface DailyChallengeCardProps {
  challenge: DailyChallenge
  onStart: (challengeId: string) => void
  onComplete: (challengeId: string) => void
  onSkip: (challengeId: string) => void
}

const categoryIcons = {
  health: Target,
  study: Star,
  finance: Zap,
  creativity: Sparkles,
  social: Trophy,
}

const categoryColors = {
  health: "bg-green-100 text-green-800 border-green-200",
  study: "bg-blue-100 text-blue-800 border-blue-200",
  finance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  creativity: "bg-purple-100 text-purple-800 border-purple-200",
  social: "bg-pink-100 text-pink-800 border-pink-200",
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-orange-100 text-orange-800",
  legendary: "bg-red-100 text-red-800",
}

export function DailyChallengeCard({ 
  challenge, 
  onStart, 
  onComplete, 
  onSkip 
}: DailyChallengeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  
  const Icon = categoryIcons[challenge.category]
  const timeRemaining = new Date(challenge.expiresAt).getTime() - Date.now()
  const hoursLeft = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))
  const minutesLeft = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)))

  const handleStart = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onStart(challenge.id)
      setIsAnimating(false)
    }, 200)
  }

  const handleComplete = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onComplete(challenge.id)
      setIsAnimating(false)
    }, 200)
  }

  const getMotivationalMessage = () => {
    if (challenge.completed) return "🎉 Desafio concluído! Você é incrível!"
    if (challenge.progress > 0) return "💪 Continue assim! Você está indo bem!"
    if (challenge.difficulty === "legendary") return "⚡ Desafio lendário! Você consegue!"
    if (challenge.difficulty === "hard") return "🔥 Desafio difícil! Mostre sua força!"
    return "🌟 Vamos começar sua jornada épica!"
  }

  return (
    <Card className={cn(
      "p-4 border-2 transition-all duration-200 hover:shadow-lg",
      categoryColors[challenge.category],
      isAnimating && "scale-105 shadow-lg",
      challenge.completed && "opacity-75"
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              categoryColors[challenge.category]
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-sm truncate">{challenge.title}</h3>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", difficultyColors[challenge.difficulty])}
                >
                  {challenge.difficulty.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {challenge.description}
              </p>
            </div>
          </div>
          
          {challenge.completed && (
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          )}
        </div>

        {/* Progress */}
        {challenge.progress > 0 && !challenge.completed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Progresso</span>
              <span className="text-xs font-bold">{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-2" />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-sm font-bold">{challenge.xpReward}</span>
            </div>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-sm font-bold">{challenge.timeEstimate}m</span>
            </div>
            <p className="text-xs text-muted-foreground">Tempo</p>
          </div>
          
          <div className="p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="h-3 w-3 text-orange-500" />
              <span className="text-sm font-bold">+{challenge.streakBonus}</span>
            </div>
            <p className="text-xs text-muted-foreground">Bônus</p>
          </div>
        </div>

        {/* Time Remaining */}
        {!challenge.completed && (
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              ⏰ {hoursLeft}h {minutesLeft}m restantes
            </p>
          </div>
        )}

        {/* Motivational Message */}
        <div className="p-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
          <p className="text-xs font-medium text-center">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!challenge.completed ? (
            <>
              {challenge.progress === 0 ? (
                <Button 
                  onClick={handleStart}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  size="sm"
                >
                  <Target className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Concluir
                </Button>
              )}
              
              <Button 
                onClick={() => onSkip(challenge.id)}
                variant="outline"
                size="sm"
                className="px-3"
              >
                Pular
              </Button>
            </>
          ) : (
            <div className="w-full text-center py-2">
              <p className="text-sm font-bold text-green-600">
                ✅ Desafio Concluído!
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
