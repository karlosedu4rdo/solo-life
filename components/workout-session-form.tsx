"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { WorkoutSession, WorkoutType, WorkoutExercise } from "@/lib/types"
import { Plus, X, Dumbbell } from "lucide-react"

interface WorkoutSessionFormProps {
  onSubmit: (session: Omit<WorkoutSession, "id" | "createdAt">) => void
  onCancel: () => void
  initialData?: WorkoutSession
}

const workoutTypes = [
  { value: "strength", label: "Força" },
  { value: "cardio", label: "Cardio" },
  { value: "flexibility", label: "Flexibilidade" },
  { value: "sports", label: "Esportes" },
  { value: "other", label: "Outro" },
]

export function WorkoutSessionForm({ onSubmit, onCancel, initialData }: WorkoutSessionFormProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [type, setType] = useState<WorkoutType>(initialData?.type || "strength")
  const [duration, setDuration] = useState(initialData?.duration?.toString() || "")
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    initialData?.exercises || [{ id: crypto.randomUUID(), name: "", sets: 3, reps: 10 }],
  )

  const addExercise = () => {
    setExercises([...exercises, { id: crypto.randomUUID(), name: "", sets: 3, reps: 10 }])
  }

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id: string, field: keyof WorkoutExercise, value: any) => {
    setExercises(exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onSubmit({
      name,
      type,
      duration: duration ? Number.parseInt(duration) : undefined,
      notes: notes || undefined,
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
    })
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Treino</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Treino de Peito e Tríceps"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as WorkoutType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (min)</Label>
            <Input
              id="duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Exercícios</Label>
            <Button type="button" variant="outline" size="sm" onClick={addExercise}>
              <Plus className="mr-1 h-3 w-3" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <div key={exercise.id} className="flex gap-2 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/20 text-primary">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nome do exercício"
                    value={exercise.name}
                    onChange={(e) => updateExercise(exercise.id, "name", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Séries"
                      value={exercise.sets || ""}
                      onChange={(e) =>
                        updateExercise(exercise.id, "sets", Number.parseInt(e.target.value) || undefined)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={exercise.reps || ""}
                      onChange={(e) =>
                        updateExercise(exercise.id, "reps", Number.parseInt(e.target.value) || undefined)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Min"
                      value={exercise.duration || ""}
                      onChange={(e) =>
                        updateExercise(exercise.id, "duration", Number.parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
                {exercises.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações sobre o treino..."
            rows={2}
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1">
            {initialData ? "Atualizar" : "Criar"} Treino
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
