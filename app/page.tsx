"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useEffect, useState } from "react"
import { usePlayer } from "@/hooks/use-player"
import { useHabits } from "@/hooks/use-habits"
import { WelcomeScreen } from "@/components/welcome-screen"
import { BottomNav } from "@/components/bottom-nav"
import { LevelDisplay } from "@/components/level-display"
import { StatCard } from "@/components/stat-card"
import { DailyMissionCard } from "@/components/daily-mission-card"
import { ProfileSettings } from "@/components/profile-settings"
import { LevelUpAnimation } from "@/components/level-up-animation"
import { XPGainToast } from "@/components/xp-gain-toast"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Heart, Zap, Coins, Bell, AlertCircle, User } from "lucide-react"
import type { DailyMission } from "@/lib/types"
import { getCurrentLevelProgress } from "@/lib/game-logic"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}

function DashboardPage() {
  const { player, isLoading, initializePlayer, gainXP, modifyStat } = usePlayer()
  const { habits, completeHabit: completeHabitInStorage } = useHabits()
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [levelUpData, setLevelUpData] = useState<{ show: boolean; level: number }>({ show: false, level: 0 })
  const [xpGainData, setXpGainData] = useState<{ show: boolean; amount: number }>({ show: false, amount: 0 })

  useEffect(() => {
    if (player && habits) {
      const today = new Date().toISOString().split("T")[0]
      const missions = habits
        .filter((habit) => habit.active && habit.frequency === "daily")
        .map((habit) => ({
          id: habit.id,
          habitId: habit.id,
          name: habit.name,
          category: habit.category,
          completed: habit.completionHistory.some((d) => d.startsWith(today)),
          xpReward: habit.xpReward,
          statReward: habit.statReward,
        }))
      setDailyMissions(missions)
    }
  }, [player, habits])

  const handleCompleteMission = (missionId: string) => {
    const mission = dailyMissions.find((m) => m.id === missionId)
    if (!mission || mission.completed) return

    completeHabitInStorage(missionId)

    const result = gainXP(mission.xpReward)

    setXpGainData({ show: true, amount: mission.xpReward })

    if (mission.statReward) {
      modifyStat(mission.statReward.stat, mission.statReward.amount)
    }

    if (result.leveledUp && result.newLevel) {
      setTimeout(() => {
        setLevelUpData({ show: true, level: result.newLevel! })
      }, 500)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!player) {
    return <WelcomeScreen onStart={initializePlayer} />
  }

  const levelProgress = getCurrentLevelProgress(player)
  const completedMissions = dailyMissions.filter((m) => m.completed).length
  const totalMissions = dailyMissions.length

  return (
    <div className="min-h-screen pb-24 safe-bottom animate-in fade-in duration-500">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(true)}
              className="hover:scale-110 transition-transform h-9 w-9 sm:h-10 sm:w-10"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            </Button>
            <button className="relative rounded-lg p-2 hover:bg-muted hover:scale-110 transition-transform h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
            </button>
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-700">
          <LevelDisplay
            level={player.level}
            currentXP={levelProgress.currentXP}
            xpToNextLevel={levelProgress.xpToNextLevel}
            playerName={player.name}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-150">
          <StatCard
            icon={<Zap className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Poder de Vontade"
            value={player.stats.willpower}
          />
          <StatCard
            icon={<Brain className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Inteligência"
            value={player.stats.intelligence}
          />
          <StatCard
            icon={<Heart className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Vitalidade"
            value={player.stats.vitality}
          />
          <StatCard
            icon={<Coins className="h-4 w-4 sm:h-5 sm:w-5" />}
            label="Riqueza"
            value={player.stats.wealth}
            maxValue={1000}
            showRank={false}
          />
        </div>

        <Card className="p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="mb-3 sm:mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Missões Diárias</h2>
            <Badge
              variant={completedMissions === totalMissions ? "default" : "secondary"}
              className="animate-in zoom-in-95 duration-300 text-xs sm:text-sm"
            >
              {completedMissions} / {totalMissions}
            </Badge>
          </div>

          {dailyMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
              <AlertCircle className="mb-2 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground animate-pulse" />
              <p className="text-sm sm:text-base text-muted-foreground">Nenhuma missão diária configurada</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Vá para Hábitos para criar suas missões</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {dailyMissions.map((mission, index) => (
                <div
                  key={mission.id}
                  className="animate-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DailyMissionCard mission={mission} onComplete={handleCompleteMission} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {player.titles.length > 0 && (
          <Card className="p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-foreground">Títulos</h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {player.titles.map((title, index) => (
                <Badge
                  key={title}
                  variant="outline"
                  className="border-primary text-primary animate-in zoom-in-95 duration-300 hover:scale-110 transition-transform text-xs sm:text-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {title}
                </Badge>
              ))}
            </div>
          </Card>
        )}
      </div>

      {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
      {levelUpData.show && (
        <LevelUpAnimation level={levelUpData.level} onClose={() => setLevelUpData({ show: false, level: 0 })} />
      )}
      {xpGainData.show && (
        <XPGainToast amount={xpGainData.amount} onClose={() => setXpGainData({ show: false, amount: 0 })} />
      )}

      <BottomNav />
    </div>
  )
}
