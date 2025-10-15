import { Card } from "@/components/ui/card"
import { StatBar } from "./stat-bar"
import { Sparkles } from "lucide-react"

interface LevelDisplayProps {
  level: number
  currentXP: number
  xpToNextLevel: number
  playerName: string
}

export function LevelDisplay({ level, currentXP, xpToNextLevel, playerName }: LevelDisplayProps) {
  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card to-card/50 p-6">
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 opacity-10">
        <Sparkles className="h-full w-full text-primary" />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{playerName}</h2>
            <p className="text-sm text-muted-foreground">Caçador Solo</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Nível</span>
            <span className="text-4xl font-bold text-primary">{level}</span>
          </div>
        </div>

        <StatBar
          label="Experiência"
          value={currentXP}
          maxValue={xpToNextLevel}
          color="bg-gradient-to-r from-primary to-accent"
        />
      </div>
    </Card>
  )
}
