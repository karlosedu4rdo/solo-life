"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { WorkoutSession } from "@/lib/types"
import { Dumbbell, Heart, Zap, Trophy, Activity, Edit, Trash2, Play } from "lucide-react"

interface WorkoutSessionCardProps {
  session: WorkoutSession
  onEdit: (session: WorkoutSession) => void
  onDelete: (id: string) => void
  onStart: (session: WorkoutSession) => void
}

const typeIcons = {
  strength: Dumbbell,
  cardio: Heart,
  flexibility: Zap,
  sports: Trophy,
  other: Activity,
}

const typeLabels = {
  strength: "Força",
  cardio: "Cardio",
  flexibility: "Flexibilidade",
  sports: "Esportes",
  other: "Outro",
}

export function WorkoutSessionCard({ session, onEdit, onDelete, onStart }: WorkoutSessionCardProps) {
  const Icon = typeIcons[session.type]

  return (
    <Card className="p-4 transition-all hover:border-primary/50">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Icon className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{session.name}</h4>
              <p className="text-sm text-muted-foreground">{session.exercises.length} exercícios</p>
            </div>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onStart(session)}>
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(session)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(session.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{typeLabels[session.type]}</Badge>
            {session.duration && <Badge variant="secondary">{session.duration} min</Badge>}
          </div>

          {session.exercises.length > 0 && (
            <div className="space-y-1 rounded-lg bg-muted/50 p-2">
              {session.exercises.slice(0, 3).map((exercise) => (
                <div key={exercise.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{exercise.name}</span>
                  <span className="text-muted-foreground">
                    {exercise.sets && exercise.reps
                      ? `${exercise.sets}x${exercise.reps}`
                      : exercise.duration
                        ? `${exercise.duration}min`
                        : ""}
                  </span>
                </div>
              ))}
              {session.exercises.length > 3 && (
                <p className="text-xs text-muted-foreground">+{session.exercises.length - 3} mais...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
