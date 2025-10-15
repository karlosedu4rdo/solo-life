"use client"

import { useState } from "react"
import { useWorkout } from "@/hooks/use-workout"
import { usePlayer } from "@/hooks/use-player"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WorkoutSessionForm } from "@/components/workout-session-form"
import { WorkoutSessionCard } from "@/components/workout-session-card"
import { WorkoutLogModal } from "@/components/workout-log-modal"
import { Plus, AlertCircle, Activity, Clock, TrendingUp } from "lucide-react"
import type { WorkoutSession } from "@/lib/types"

export default function WorkoutPage() {
  const { sessions, logs, isLoading, addSession, updateSession, deleteSession, logWorkout, getStats } = useWorkout()
  const { modifyStat, gainXP } = usePlayer()
  const [showForm, setShowForm] = useState(false)
  const [editingSession, setEditingSession] = useState<WorkoutSession | null>(null)
  const [loggingSession, setLoggingSession] = useState<WorkoutSession | null>(null)
  const [activeTab, setActiveTab] = useState<"sessions" | "history">("sessions")

  const stats = getStats()

  const handleAddSession = (sessionData: Parameters<typeof addSession>[0]) => {
    addSession(sessionData)
    setShowForm(false)
  }

  const handleUpdateSession = (sessionData: Parameters<typeof addSession>[0]) => {
    if (editingSession) {
      updateSession(editingSession.id, sessionData)
      setEditingSession(null)
    }
  }

  const handleLogWorkout = (logData: Parameters<typeof logWorkout>[0]) => {
    logWorkout(logData)
    setLoggingSession(null)

    modifyStat("vitality", 5)
    gainXP(20)
  }

  const handleEdit = (session: WorkoutSession) => {
    setEditingSession(session)
    setShowForm(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Treino</h1>
            <p className="text-sm text-muted-foreground">Organização e Progresso</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm)
              setEditingSession(null)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Treino
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Estatísticas</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-foreground">{sessions.length}</p>
              <p className="text-xs text-muted-foreground">Treinos Criados</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-accent">{stats.totalWorkouts}</p>
              <p className="text-xs text-muted-foreground">Total Realizados</p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-3xl font-bold text-primary">{stats.weeklyWorkouts}</p>
              <p className="text-xs text-muted-foreground">Esta Semana</p>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-3xl font-bold text-foreground">{stats.weeklyDuration}</p>
              </div>
              <p className="text-xs text-muted-foreground">Min/Semana</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "sessions" ? "default" : "outline"}
            onClick={() => setActiveTab("sessions")}
            className="flex-1"
          >
            Treinos ({sessions.length})
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "outline"}
            onClick={() => setActiveTab("history")}
            className="flex-1"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Histórico ({logs.length})
          </Button>
        </div>

        {activeTab === "sessions" && (
          <div className="space-y-4">
            {showForm && <WorkoutSessionForm onSubmit={handleAddSession} onCancel={() => setShowForm(false)} />}

            {editingSession && (
              <WorkoutSessionForm
                initialData={editingSession}
                onSubmit={handleUpdateSession}
                onCancel={() => setEditingSession(null)}
              />
            )}

            {sessions.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-dashed py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum treino criado</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Crie seus treinos e organize sua rotina de exercícios
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Treino
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <WorkoutSessionCard
                    key={session.id}
                    session={session}
                    onEdit={handleEdit}
                    onDelete={deleteSession}
                    onStart={setLoggingSession}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-dashed py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">Nenhum treino registrado</h3>
                <p className="text-sm text-muted-foreground">Comece um treino para registrar seu progresso</p>
              </Card>
            ) : (
              logs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{log.sessionName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{log.duration} min</p>
                      <p className="text-xs text-muted-foreground">{log.exercises.length} exercícios</p>
                    </div>
                  </div>
                  {log.notes && <p className="mt-2 text-sm text-muted-foreground">{log.notes}</p>}
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {loggingSession && (
        <WorkoutLogModal
          session={loggingSession}
          onSubmit={handleLogWorkout}
          onCancel={() => setLoggingSession(null)}
        />
      )}

      <BottomNav />
    </div>
  )
}
