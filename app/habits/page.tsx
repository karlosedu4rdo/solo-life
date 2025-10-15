"use client"

import { useState } from "react"
import { useHabits } from "@/hooks/use-habits"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { HabitForm } from "@/components/habit-form"
import { HabitCard } from "@/components/habit-card"
import { HabitCalendar } from "@/components/habit-calendar"
import { PenaltyMissionModal } from "@/components/penalty-mission-modal"
import { Plus, AlertCircle } from "lucide-react"
import type { Habit } from "@/lib/types"

export default function HabitsPage() {
  const { habits, isLoading, addHabit, deleteHabit, completeHabit, uncompleteHabit, getFailedMissionsCount } =
    useHabits()
  const [showForm, setShowForm] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)

  const failedCount = getFailedMissionsCount()

  const handleAddHabit = (habitData: Parameters<typeof addHabit>[0]) => {
    addHabit(habitData)
    setShowForm(false)
  }

  const handleToggleDay = (date: string) => {
    if (!selectedHabit) return

    const dateOnly = date.split("T")[0]
    const isCompleted = selectedHabit.completionHistory.some((d) => d.startsWith(dateOnly))

    if (isCompleted) {
      uncompleteHabit(selectedHabit.id, date)
    } else {
      completeHabit(selectedHabit.id, date)
    }

    // Update selected habit to reflect changes
    const updatedHabit = habits.find((h) => h.id === selectedHabit.id)
    if (updatedHabit) {
      setSelectedHabit(updatedHabit)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (selectedHabit) {
    return (
      <div className="min-h-screen pb-24 safe-bottom">
        <div className="mx-auto max-w-4xl p-3 sm:p-4">
          <HabitCalendar habit={selectedHabit} onToggleDay={handleToggleDay} onClose={() => setSelectedHabit(null)} />
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24 safe-bottom">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Sistema de Hábitos</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">O Ritual</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Hábito
          </Button>
        </div>

        {failedCount >= 5 && (
          <div
            className="flex cursor-pointer items-center gap-2 sm:gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 sm:p-4"
            onClick={() => setShowPenaltyModal(true)}
          >
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-destructive text-sm sm:text-base">Missão de Penalidade Disponível</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Você tem {failedCount} missões falhadas</p>
            </div>
            <Button variant="destructive" size="sm" className="flex-shrink-0 text-xs sm:text-sm">
              Ver
            </Button>
          </div>
        )}

        {showForm && <HabitForm onSubmit={handleAddHabit} onCancel={() => setShowForm(false)} />}

        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 sm:py-12 text-center px-4">
            <AlertCircle className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            <h3 className="mb-2 text-base sm:text-lg font-semibold text-foreground">Nenhum hábito criado</h3>
            <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground max-w-sm">
              Comece sua jornada criando seu primeiro hábito
            </p>
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Hábito
            </Button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onDelete={deleteHabit}
                onEdit={(h) => console.log("Edit", h)}
                onClick={setSelectedHabit}
              />
            ))}
          </div>
        )}
      </div>

      {showPenaltyModal && (
        <PenaltyMissionModal
          failedCount={failedCount}
          onAccept={() => {
            setShowPenaltyModal(false)
          }}
          onDismiss={() => setShowPenaltyModal(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}
