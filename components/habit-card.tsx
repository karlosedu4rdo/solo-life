"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Habit } from "@/lib/types"
import { Flame, Trash2, Edit, Zap } from "lucide-react"

interface HabitCardProps {
  habit: Habit
  onDelete: (id: string) => void
  onEdit: (habit: Habit) => void
  onClick: (habit: Habit) => void
}

const categoryLabels: Record<string, string> = {
  health: "Saúde",
  study: "Estudo",
  creativity: "Criatividade",
  finance: "Finanças",
  social: "Social",
}

const frequencyLabels: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
}

export function HabitCard({ habit, onDelete, onEdit, onClick }: HabitCardProps) {
  return (
    <Card className="p-4 transition-all hover:border-primary/50 hover:shadow-lg">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <button onClick={() => onClick(habit)} className="flex-1 text-left">
            <h3 className="font-semibold text-foreground">{habit.name}</h3>
            {habit.description && <p className="mt-1 text-sm text-muted-foreground">{habit.description}</p>}
          </button>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(habit)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(habit.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{categoryLabels[habit.category]}</Badge>
          <Badge variant="secondary">{frequencyLabels[habit.frequency]}</Badge>

          {habit.streak > 0 && (
            <Badge className="gap-1 bg-primary/20 text-primary">
              <Flame className="h-3 w-3" />
              {habit.streak} dias
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-primary" />
            <span>+{habit.xpReward} XP</span>
          </div>

          {habit.statReward && (
            <span className="text-accent">
              +{habit.statReward.amount} {habit.statReward.stat}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
