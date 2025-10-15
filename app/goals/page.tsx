"use client"

import { useState } from "react"
import { useAchievements } from "@/hooks/use-achievements"
import { usePlayer } from "@/hooks/use-player"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { AchievementForm } from "@/components/achievement-form"
import { AchievementCard } from "@/components/achievement-card"
import { AchievementDetail } from "@/components/achievement-detail"
import { Plus, Trophy, AlertCircle } from "lucide-react"
import type { Achievement } from "@/lib/types"

export default function GoalsPage() {
  const {
    achievements,
    isLoading,
    addAchievement,
    deleteAchievement,
    toggleSubTask,
    getCompletedAchievements,
    getInProgressAchievements,
  } = useAchievements()
  const { gainXP, addTitle } = usePlayer()
  const [showForm, setShowForm] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all")

  const handleAddAchievement = (achievementData: Parameters<typeof addAchievement>[0]) => {
    addAchievement(achievementData)
    setShowForm(false)
  }

  const handleToggleSubTask = (subTaskId: string) => {
    if (!selectedAchievement) return

    const subTask = selectedAchievement.subTasks.find((t) => t.id === subTaskId)
    if (!subTask) return

    // Award XP if completing the task
    if (!subTask.completed) {
      gainXP(subTask.xpReward)
    }

    toggleSubTask(selectedAchievement.id, subTaskId)

    // Update selected achievement
    const updatedAchievement = achievements.find((a) => a.id === selectedAchievement.id)
    if (updatedAchievement) {
      setSelectedAchievement(updatedAchievement)

      // Check if achievement was just completed
      if (updatedAchievement.completed && !selectedAchievement.completed) {
        if (updatedAchievement.titleReward) {
          addTitle(updatedAchievement.titleReward)
        }
      }
    }
  }

  const filteredAchievements =
    filter === "all"
      ? achievements
      : filter === "in-progress"
        ? getInProgressAchievements()
        : getCompletedAchievements()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (selectedAchievement) {
    return (
      <div className="min-h-screen pb-24">
        <div className="mx-auto max-w-4xl p-4">
          <AchievementDetail
            achievement={selectedAchievement}
            onToggleSubTask={handleToggleSubTask}
            onBack={() => setSelectedAchievement(null)}
          />
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sistema de Metas</h1>
            <p className="text-sm text-muted-foreground">As Conquistas</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Conquista
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{achievements.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4 text-center">
            <p className="text-2xl font-bold text-primary">{getInProgressAchievements().length}</p>
            <p className="text-sm text-muted-foreground">Em Progresso</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-4 text-center">
            <p className="text-2xl font-bold text-accent">{getCompletedAchievements().length}</p>
            <p className="text-sm text-muted-foreground">Completas</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className="flex-1"
          >
            Todas
          </Button>
          <Button
            variant={filter === "in-progress" ? "default" : "outline"}
            onClick={() => setFilter("in-progress")}
            size="sm"
            className="flex-1"
          >
            Em Progresso
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            size="sm"
            className="flex-1"
          >
            Completas
          </Button>
        </div>

        {showForm && <AchievementForm onSubmit={handleAddAchievement} onCancel={() => setShowForm(false)} />}

        {filteredAchievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
            {filter === "all" ? (
              <>
                <Trophy className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhuma conquista criada</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Defina suas metas de longo prazo e conquiste títulos
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Conquista
                </Button>
              </>
            ) : (
              <>
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhuma conquista {filter === "in-progress" ? "em progresso" : "completa"}
                </h3>
                <p className="text-sm text-muted-foreground">Tente outro filtro</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onDelete={deleteAchievement}
                onClick={setSelectedAchievement}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
