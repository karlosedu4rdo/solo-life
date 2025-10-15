"use client"

import { usePlayer } from "@/hooks/use-player"
import { useHabits } from "@/hooks/use-habits"
import { useAchievements } from "@/hooks/use-achievements"
import { BottomNav } from "@/components/bottom-nav"
import { StatsOverview } from "@/components/stats-overview"
import { StatEvolutionChart } from "@/components/stat-evolution-chart"
import { ActivityHeatmap } from "@/components/activity-heatmap"
import { AchievementsShowcase } from "@/components/achievements-showcase"
import { LevelHistory } from "@/components/level-history"
import { Card } from "@/components/ui/card"
import { Target, TrendingUp, Flame } from "lucide-react"

export default function StatsPage() {
  const { player, isLoading: playerLoading } = usePlayer()
  const { habits, isLoading: habitsLoading } = useHabits()
  const { achievements, isLoading: achievementsLoading, getCompletedAchievements } = useAchievements()

  if (playerLoading || habitsLoading || achievementsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-24">
        <p className="text-muted-foreground">Nenhum jogador encontrado</p>
      </div>
    )
  }

  // Calculate activity heatmap data
  const activityData: Record<string, number> = {}
  habits.forEach((habit) => {
    habit.completionHistory.forEach((date) => {
      const dateOnly = date.split("T")[0]
      activityData[dateOnly] = (activityData[dateOnly] || 0) + 1
    })
  })

  // Generate mock stat evolution data (in a real app, this would be tracked over time)
  const generateStatData = (baseStat: number) => {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        value: Math.max(0, baseStat - Math.floor(Math.random() * 10) + i),
      })
    }

    return data
  }

  const totalHabits = habits.length
  const activeHabits = habits.filter((h) => h.active).length
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
  const completedAchievements = getCompletedAchievements().length

  // Calculate total XP (current level XP + current XP)
  const totalXP = player.currentXP + (player.level - 1) * 100

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
          <p className="text-sm text-muted-foreground">O Sistema</p>
        </div>

        {/* Level History */}
        <LevelHistory level={player.level} totalXP={totalXP} createdAt={player.createdAt} />

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Target className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-2xl font-bold text-foreground">{activeHabits}</p>
            <p className="text-xs text-muted-foreground">Hábitos Ativos</p>
          </Card>

          <Card className="p-4 text-center">
            <Flame className="mx-auto mb-2 h-8 w-8 text-accent" />
            <p className="text-2xl font-bold text-foreground">{totalStreak}</p>
            <p className="text-xs text-muted-foreground">Streak Total</p>
          </Card>

          <Card className="p-4 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-secondary" />
            <p className="text-2xl font-bold text-foreground">{completedAchievements}</p>
            <p className="text-xs text-muted-foreground">Conquistas</p>
          </Card>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={player.stats} />

        {/* Activity Heatmap */}
        <ActivityHeatmap title="Atividade nos Últimos 3 Meses" data={activityData} />

        {/* Stat Evolution Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatEvolutionChart
            title="Evolução - Poder de Vontade"
            data={generateStatData(player.stats.willpower)}
            color="hsl(var(--primary))"
          />
          <StatEvolutionChart
            title="Evolução - Inteligência"
            data={generateStatData(player.stats.intelligence)}
            color="hsl(var(--accent))"
          />
          <StatEvolutionChart
            title="Evolução - Vitalidade"
            data={generateStatData(player.stats.vitality)}
            color="hsl(var(--secondary))"
          />
          <StatEvolutionChart
            title="Evolução - Riqueza"
            data={generateStatData(player.stats.wealth)}
            color="hsl(var(--chart-4))"
          />
        </div>

        {/* Achievements Showcase */}
        <AchievementsShowcase
          titles={player.titles}
          completedAchievements={completedAchievements}
          totalAchievements={achievements.length}
        />
      </div>

      <BottomNav />
    </div>
  )
}
