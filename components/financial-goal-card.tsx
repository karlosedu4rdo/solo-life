"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { FinancialGoal } from "@/lib/types"
import { Target, Trash2, Plus } from "lucide-react"

interface FinancialGoalCardProps {
  goal: FinancialGoal
  onDelete: (id: string) => void
  onAddProgress: (id: string, amount: number) => void
}

export function FinancialGoalCard({ goal, onDelete, onAddProgress }: FinancialGoalCardProps) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const deadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{goal.name}</h4>
              {deadline && <p className="text-sm text-muted-foreground">Prazo: {deadline}</p>}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(goal.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-semibold text-foreground">
              R$ {goal.currentAmount.toFixed(2)} / R$ {goal.targetAmount.toFixed(2)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{progress.toFixed(1)}% completo</span>
            {remaining > 0 && <span className="text-xs text-muted-foreground">Faltam R$ {remaining.toFixed(2)}</span>}
          </div>
        </div>

        {goal.completed ? (
          <Badge className="w-full justify-center">Meta Alcançada!</Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => {
              const amount = prompt("Quanto deseja adicionar ao progresso?")
              if (amount && !isNaN(Number.parseFloat(amount))) {
                onAddProgress(goal.id, Number.parseFloat(amount))
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Progresso
          </Button>
        )}
      </div>
    </Card>
  )
}
