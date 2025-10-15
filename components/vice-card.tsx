"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Vice } from "@/lib/types"
import { AlertTriangle, Edit, Trash2, RotateCcw } from "lucide-react"

interface ViceCardProps {
  vice: Vice
  onEdit: (vice: Vice) => void
  onDelete: (id: string) => void
  onRelapse: (id: string) => void
}

const severityColors = {
  low: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  medium: "bg-orange-500/20 text-orange-500 border-orange-500/50",
  high: "bg-red-500/20 text-red-500 border-red-500/50",
}

const severityLabels = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
}

export function ViceCard({ vice, onEdit, onDelete, onRelapse }: ViceCardProps) {
  return (
    <Card className="p-4 transition-all hover:border-primary/50">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/20 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{vice.name}</h4>
              {vice.description && <p className="text-sm text-muted-foreground">{vice.description}</p>}
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(vice)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(vice.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={severityColors[vice.severity]}>
              Severidade: {severityLabels[vice.severity]}
            </Badge>
            <Badge variant={vice.active ? "default" : "secondary"}>{vice.active ? "Ativo" : "Inativo"}</Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div>
              <p className="text-2xl font-bold text-foreground">{vice.daysClean}</p>
              <p className="text-xs text-muted-foreground">dias limpo</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onRelapse(vice.id)} className="text-destructive">
              <RotateCcw className="mr-1 h-3 w-3" />
              Registrar Recaída
            </Button>
          </div>

          {vice.alternativeBehavior && (
            <div className="rounded-lg bg-accent/10 p-2">
              <p className="text-xs font-semibold text-accent">Comportamento Alternativo:</p>
              <p className="text-sm text-muted-foreground">{vice.alternativeBehavior}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
