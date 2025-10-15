"use client"

import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface LevelHistoryProps {
  level: number
  totalXP: number
  createdAt: string
}

export function LevelHistory({ level, totalXP, createdAt }: LevelHistoryProps) {
  const accountAge = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">Progressão do Jogador</h3>
          <div className="mt-2 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{level}</p>
              <p className="text-xs text-muted-foreground">Nível</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{totalXP}</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{accountAge}</p>
              <p className="text-xs text-muted-foreground">Dias</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
