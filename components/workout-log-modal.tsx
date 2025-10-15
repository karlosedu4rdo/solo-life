"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import type { WorkoutSession, WorkoutLog } from "@/lib/types"
import { X, Check } from "lucide-react"

interface WorkoutLogModalProps {
  session: WorkoutSession
  onSubmit: (log: Omit<WorkoutLog, "id" | "createdAt">) => void
  onCancel: () => void
}

export function WorkoutLogModal({ session, onSubmit, onCancel }: WorkoutLogModalProps) {
  const [duration, setDuration] = useState(session.duration?.toString() || "")
  const [notes, setNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      sessionId: session.id,
      sessionName: session.name,
      date: new Date().toISOString(),
      duration: Number.parseInt(duration) || 0,
      exercises: session.exercises,
      notes: notes || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Registrar Treino</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-semibold text-foreground">{session.name}</p>
            <p className="text-sm text-muted-foreground">{session.exercises.length} exercícios</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino? Alguma observação?"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              <Check className="mr-2 h-4 w-4" />
              Registrar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
