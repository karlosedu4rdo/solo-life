"use client"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PlayerStats } from "@/lib/types"
import { getStatRank, getStatColor } from "@/lib/game-logic"
import { Brain, Heart, Zap, Coins } from "lucide-react"

interface StatsOverviewProps {
  stats: PlayerStats
}

const statIcons = {
  willpower: Zap,
  intelligence: Brain,
  vitality: Heart,
  wealth: Coins,
}

const statLabels = {
  willpower: "Poder de Vontade",
  intelligence: "Inteligência",
  vitality: "Vitalidade",
  wealth: "Riqueza",
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Árvore de Estatísticas</h3>
      <div className="space-y-4">
        {Object.entries(stats).map(([key, value]) => {
          const statKey = key as keyof PlayerStats
          const Icon = statIcons[statKey]
          const rank = getStatRank(value)
          const colorClass = getStatColor(value)
          const percentage = Math.min((value / 100) * 100, 100)

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{statLabels[statKey]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-2xl font-bold", colorClass)}>{value}</span>
                  <span className={cn("text-sm font-semibold", colorClass)}>({rank})</span>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
